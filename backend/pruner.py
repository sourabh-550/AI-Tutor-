from sentence_transformers import CrossEncoder

# Load cross-encoder once
reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

def prune_context(
    query: str,
    candidates: list[dict],
    similarity_threshold: float = 0.25,
    top_k: int = 5
) -> list[dict]:
    """
    Three-stage pruning:
    1. Filter by similarity threshold
    2. Re-rank using cross-encoder
    3. Keep top-K
    """
    
    # --- Stage 1: Similarity Threshold Filter ---
    filtered = [c for c in candidates if c["score"] >= similarity_threshold]
    
    if not filtered:
        # Fallback: take top 3 even if below threshold
        filtered = candidates[:3]
    
    # --- Stage 2: Cross-Encoder Re-ranking ---
    pairs = [[query, c["chunk"]] for c in filtered]
    rerank_scores = reranker.predict(pairs)
    
    for i, item in enumerate(filtered):
        item["rerank_score"] = float(rerank_scores[i])
    
    # Sort by rerank score descending
    reranked = sorted(filtered, key=lambda x: x["rerank_score"], reverse=True)
    
    # --- Stage 3: Top-K Selection ---
    final = reranked[:top_k]
    
    return final