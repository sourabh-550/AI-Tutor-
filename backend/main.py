import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from pdf_processor import extract_chunks
from embedder import build_and_save_index, search
from pruner import prune_context
from llm_client import ask_llm

app = FastAPI(title="AI Tutor - RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    question: str
    top_k: int = 5
    similarity_threshold: float = 0.25

class QuestionResponse(BaseModel):
    answer: str
    sources: list[dict]
    total_candidates: int
    pruned_count: int

@app.get("/")
def health():
    return {"status": "ok", "message": "AI Tutor API running"}

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")
    
    file_bytes = await file.read()
    
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded")
    
    chunks = extract_chunks(file_bytes)
    
    if not chunks:
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")
    
    num_chunks = build_and_save_index(chunks)
    
    return {
        "message": "PDF processed successfully",
        "filename": file.filename,
        "chunks_created": num_chunks
    }

@app.post("/ask", response_model=QuestionResponse)
def ask_question(body: QuestionRequest):
    if not body.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    # Retrieve top-20 candidates from FAISS
    try:
        candidates = search(body.question, top_k=20)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
    total_candidates = len(candidates)
    
    # Apply context pruning
    pruned = prune_context(
        query=body.question,
        candidates=candidates,
        similarity_threshold=body.similarity_threshold,
        top_k=body.top_k
    )
    
    # Build context list for LLM
    context_texts = [item["chunk"] for item in pruned]
    
    # Call Groq LLM
    answer = ask_llm(body.question, context_texts)
    
    # Prepare source info for frontend
    sources = [
        {
            "chunk": item["chunk"][:200] + "..." if len(item["chunk"]) > 200 else item["chunk"],
            "similarity_score": round(item["score"], 4),
            "rerank_score": round(item.get("rerank_score", 0), 4)
        }
        for item in pruned
    ]
    
    return QuestionResponse(
        answer=answer,
        sources=sources,
        total_candidates=total_candidates,
        pruned_count=len(pruned)
    )