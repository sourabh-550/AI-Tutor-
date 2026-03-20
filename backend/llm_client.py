import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """You are an AI tutor for students in rural India.
Explain concepts clearly and simply. Use the provided context only.
If the answer is not in the context, say "I don't have enough information to answer this."
Keep answers concise, helpful, and easy to understand."""

def ask_llm(query: str, context_chunks: list[str]) -> str:
    context_text = "\n\n---\n\n".join(context_chunks)
    
    user_message = f"""Context from the document:
{context_text}

Student's question: {query}

Answer clearly and simply:"""
    
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message}
        ],
        temperature=0.3,
        max_tokens=512
    )
    
    return response.choices[0].message.content