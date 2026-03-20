import fitz  # PyMuPDF

def extract_chunks(file_bytes: bytes, chunk_size: int = 300, overlap: int = 20) -> list[str]:
    """Extract text from PDF bytes and split into overlapping chunks."""
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    
    full_text = ""
    for page in doc:
        full_text += page.get_text("text") + "\n"
    doc.close()
    
    # Clean text
    full_text = " ".join(full_text.split())
    
    words = full_text.split()
    chunks = []
    
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        if chunk.strip():
            chunks.append(chunk)
        start += chunk_size - overlap  # sliding window with overlap
    
    return chunks