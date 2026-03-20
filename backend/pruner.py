def prune_context(
    query: str,
    candidates: list[dict],
    similarity_threshold: float = 0.25,
    top_k: int = 5
) -> list[dict]:
    """
    Lightweight 2-stage pruning (no cross-encoder on free tier):
    1. Similarity threshold filter
    2. Top-K selection by FAISS score
    """
    # Stage 1: Threshold filter
    filtered = [c for c in candidates if c["score"] >= similarity_threshold]

    if not filtered:
        filtered = candidates[:3]

    # Stage 2: Top-K by FAISS score (skip heavy cross-encoder)
    reranked = sorted(filtered, key=lambda x: x["score"], reverse=True)

    final = reranked[:top_k]

    # Add rerank_score same as score for frontend compatibility
    for item in final:
        item["rerank_score"] = item["score"]

    return final