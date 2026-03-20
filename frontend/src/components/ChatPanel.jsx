import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function ChatPanel({ onAnswer }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const ask = async () => {
    const q = question.trim();
    if (!q || loading) return;

    setMessages(prev => [...prev, { role: "user", text: q }]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await axios.post("https://vidya-ai-backend.onrender.com", {
        question: q,
        top_k: 5,
        similarity_threshold: 0.25,
      });
      setMessages(prev => [...prev, {
        role: "assistant",
        text: res.data.answer,
        meta: { total: res.data.total_candidates, pruned: res.data.pruned_count }
      }]);
      onAnswer(res.data.sources, {
        total: res.data.total_candidates,
        pruned: res.data.pruned_count,
      });
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "Sorry, something went wrong. Please try again.",
        error: true
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="chat-card">
      <div className="chat-card-header">
        <div className="step-badge">02</div>
        <div>
          <h3 className="card-title">Ask Questions</h3>
          <p className="card-sub">Powered by context-pruned RAG</p>
        </div>
      </div>

      <div className="messages-area">
        {messages.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p>Ask anything about your document</p>
            <div className="suggestions">
              {["Summarize the main topics", "What are the key concepts?", "Explain the first chapter"].map(s => (
                <button key={s} className="suggestion-chip" onClick={() => { setQuestion(s); inputRef.current?.focus(); }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`message message-${msg.role} ${msg.error ? "message-error" : ""}`}>
            <div className="message-avatar">
              {msg.role === "user" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div className="message-body">
              <p className="message-text">{msg.text}</p>
              {msg.meta && (
                <div className="message-meta">
                  <span>{msg.meta.pruned} chunks used</span>
                  <span>·</span>
                  <span>{msg.meta.total} candidates searched</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="message message-assistant">
            <div className="message-avatar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="message-body">
              <div className="typing-dots">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="input-area">
        <input
          ref={inputRef}
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && ask()}
          placeholder="Ask a question about your document..."
          disabled={loading}
          className="chat-input"
        />
        <button onClick={ask} disabled={loading || !question.trim()} className="send-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <style>{`
        .chat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          display: flex; flex-direction: column;
          height: calc(100vh - 140px); min-height: 500px;
        }
        .chat-card-header {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 24px 24px 20px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .step-badge {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          background: var(--accent-glow); border: 1px solid var(--accent);
          color: var(--accent); font-family: var(--font-display);
          font-weight: 700; font-size: 14px;
          display: flex; align-items: center; justify-content: center;
        }
        .card-title { font-family: var(--font-display); font-weight: 700; font-size: 16px; margin-bottom: 2px; }
        .card-sub { font-size: 12px; color: var(--text3); }

        .messages-area {
          flex: 1; overflow-y: auto; padding: 20px 24px;
          display: flex; flex-direction: column; gap: 16px;
          scrollbar-width: thin; scrollbar-color: var(--border) transparent;
        }

        .empty-state {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 16px;
          color: var(--text3); text-align: center; padding: 40px 0;
        }
        .empty-icon {
          width: 52px; height: 52px; border-radius: 14px;
          background: var(--surface2); border: 1px solid var(--border2);
          display: flex; align-items: center; justify-content: center;
          color: var(--text3);
        }
        .empty-state p { font-size: 14px; }
        .suggestions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 4px; }
        .suggestion-chip {
          background: var(--surface2); border: 1px solid var(--border2);
          color: var(--text2); border-radius: 20px;
          padding: 6px 14px; font-size: 12px; cursor: pointer;
          font-family: var(--font-body); transition: all 0.15s;
        }
        .suggestion-chip:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-glow); }

        .message { display: flex; gap: 12px; align-items: flex-start; animation: fadeUp 0.25s ease; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .message-avatar {
          width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          margin-top: 2px;
        }
        .message-user .message-avatar { background: var(--accent); color: #fff; margin-left: auto; order: 2; }
        .message-assistant .message-avatar { background: var(--surface2); border: 1px solid var(--border2); color: var(--accent); }

        .message-user { flex-direction: row-reverse; }
        .message-user .message-body { align-items: flex-end; }

        .message-body { display: flex; flex-direction: column; gap: 4px; max-width: 80%; }
        .message-text {
          padding: 12px 16px; border-radius: 12px;
          font-size: 14px; line-height: 1.65;
        }
        .message-user .message-text {
          background: var(--accent); color: #fff;
          border-bottom-right-radius: 4px;
        }
        .message-assistant .message-text {
          background: var(--surface2); color: var(--text);
          border: 1px solid var(--border);
          border-bottom-left-radius: 4px;
        }
        .message-error .message-text { border-color: rgba(239,68,68,0.3); color: #f87171; }
        .message-meta {
          display: flex; gap: 6px; font-size: 11px; color: var(--text3);
          padding: 0 4px;
        }

        .typing-dots {
          display: flex; gap: 5px; align-items: center;
          padding: 14px 18px;
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 12px; border-bottom-left-radius: 4px;
        }
        .typing-dots span {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--text3); animation: bounce 1.2s infinite;
        }
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }

        .input-area {
          padding: 16px 20px; border-top: 1px solid var(--border);
          display: flex; gap: 10px; align-items: center; flex-shrink: 0;
        }
        .chat-input {
          flex: 1; background: var(--surface2);
          border: 1px solid var(--border2); border-radius: 12px;
          padding: 12px 16px; color: var(--text);
          font-family: var(--font-body); font-size: 14px;
          outline: none; transition: border-color 0.2s;
        }
        .chat-input::placeholder { color: var(--text3); }
        .chat-input:focus { border-color: var(--accent); }
        .chat-input:disabled { opacity: 0.5; cursor: not-allowed; }

        .send-btn {
          width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
          background: var(--accent); border: none; color: #fff;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .send-btn:hover:not(:disabled) { background: var(--accent2); transform: scale(1.05); }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
      `}</style>
    </div>
  );
}