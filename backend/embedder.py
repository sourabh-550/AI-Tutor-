import os
import pickle
import numpy as np
import faiss

STORE_DIR = "faiss_store"
INDEX_PATH = os.path.join(STORE_DIR, "index.faiss")
CHUNKS_PATH = os.path.join(STORE_DIR, "chunks.pkl")

# Don't load at startup — load only when first needed
_model = None

def get_model():
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model

def embed_texts(texts: list[str]) -> np.ndarray:
    embeddings = get_model().encode(texts, show_progress_bar=False, convert_to_numpy=True)
    return embeddings.astype("float32")

def build_and_save_index(chunks: list[str]):
    os.makedirs(STORE_DIR, exist_ok=True)
    embeddings = embed_texts(chunks)
    dim = embeddings.shape[1]
    index = faiss.IndexFlatIP(dim)
    faiss.normalize_L2(embeddings)
    index.add(embeddings)
    faiss.write_index(index, INDEX_PATH)
    with open(CHUNKS_PATH, "wb") as f:
        pickle.dump(chunks, f)
    return len(chunks)

def search(query: str, top_k: int = 20) -> list[dict]:
    if not os.path.exists(INDEX_PATH):
        raise FileNotFoundError("No FAISS index found. Upload a PDF first.")
    index = faiss.read_index(INDEX_PATH)
    with open(CHUNKS_PATH, "rb") as f:
        chunks = pickle.load(f)
    query_embedding = embed_texts([query])
    faiss.normalize_L2(query_embedding)
    scores, indices = index.search(query_embedding, min(top_k, len(chunks)))
    results = []
    for score, idx in zip(scores[0], indices[0]):
        if idx != -1:
            results.append({
                "chunk": chunks[idx],
                "score": float(score),
                "index": int(idx)
            })
    return results