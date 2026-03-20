_reranker = None

def get_reranker():
    global _reranker
    if _reranker is None:
        from sentence_transformers import CrossEncoder
        _reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
    return _reranker

def prune_context(
    query: str,
    candidates: list[dict],
    similarity_threshold: float = 0.25,
    top_k: int = 5
) -> list[dict]:
    filtered = [c for c in candidates if c["score"] >= similarity_threshold]
    if not filtered:
        filtered = candidates[:3]
    pairs = [[query, c["chunk"]] for c in filtered]
    rerank_scores = get_reranker().predict(pairs)
    for i, item in enumerate(filtered):
        item["rerank_score"] = float(rerank_scores[i])
    reranked = sorted(filtered, key=lambda x: x["rerank_score"], reverse=True)
    return reranked[:top_k]