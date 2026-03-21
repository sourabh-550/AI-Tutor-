import os
import pickle
import numpy as np
import faiss
import cohere
from dotenv import load_dotenv

load_dotenv()

STORE_DIR = "faiss_store"
INDEX_PATH = os.path.join(STORE_DIR, "index.faiss")
CHUNKS_PATH = os.path.join(STORE_DIR, "chunks.pkl")

client = cohere.Client(os.getenv("COHERE_API_KEY"))

def embed_texts(texts: list[str]) -> np.ndarray:
    """Use Cohere free API — no local model needed."""
    all_embeddings = []
    batch_size = 96  # Cohere limit per request

    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        response = client.embed(
            texts=batch,
            model="embed-english-light-v3.0",  # fastest free model
            input_type="search_document"
        )
        all_embeddings.extend(response.embeddings)

    return np.array(all_embeddings, dtype="float32")

def embed_query(text: str) -> np.ndarray:
    """Query embedding uses different input_type."""
    response = client.embed(
        texts=[text],
        model="embed-english-light-v3.0",
        input_type="search_query"
    )
    return np.array(response.embeddings, dtype="float32")

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
    query_embedding = embed_query(query)
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

def get_model():
    pass  # No local model needed