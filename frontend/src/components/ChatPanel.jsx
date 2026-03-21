import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function ChatPanel({ onAnswer }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();
  const inputRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const ask = async () => {
    const q = question.trim();
    if (!q || loading) return;
    setMessages(p => [...p, { role: "user", text: q }]);
    setQuestion("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/ask", { question: q, top_k: 5, similarity_threshold: 0.25 });
      setMessages(p => [...p, { role: "ai", text: res.data.answer, meta: { total: res.data.total_candidates, pruned: res.data.pruned_count } }]);
      onAnswer(res.data.sources, { total: res.data.total_candidates, pruned: res.data.pruned_count });
    } catch {
      setMessages(p => [...p, { role: "ai", text: "Something went wrong. Please try again.", error: true }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  };

  const suggestions = ["Summarize the key topics", "What are the main concepts?", "Explain the first chapter"];

  return (
    <div className="chat">
      <div className="chat-head">
        <div className="card-num">02</div>
        <div>
          <h3 className="chat-title">Ask Questions</h3>
          <p className="chat-sub">Powered by context-pruned RAG</p>
        </div>
      </div>

      <div className="msgs">
        {messages.length === 0 && (
          <div className="empty">
            <div className="empty-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="empty-title">Ask anything about your document</p>
            <p className="empty-sub">Try one of these to get started</p>
            <div className="chips">
              {suggestions.map(s => (
                <button key={s} className="chip" onClick={() => { setQuestion(s); inputRef.current?.focus(); }}>{s}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`msg msg-${m.role} ${m.error ? "msg-err" : ""}`}>
            <div className="avatar">
              {m.role === "user" ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div className="msg-body">
              <p className="msg-text">{m.text}</p>
              {m.meta && (
                <div className="msg-meta">
                  <span>{m.meta.pruned} passages used</span>
                  <span>·</span>
                  <span>{m.meta.total} searched</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="msg msg-ai">
            <div className="avatar ai-avatar">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="msg-body">
              <div className="typing">
                <span/><span/><span/>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="input-row">
        <input
          ref={inputRef}
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && ask()}
          placeholder="Ask a question about your document..."
          disabled={loading}
          className="input"
          autoFocus
        />
        <button onClick={ask} disabled={loading || !question.trim()} className="send">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <style>{`
        .chat {
          background: var(--surface);
          border: 1px solid var(--border2);
          border-radius: var(--r);
          display: flex; flex-direction: column;
          height: calc(100vh - 108px); min-height: 520px;
          backdrop-filter: blur(12px);
          box-shadow: 0 24px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .chat-head {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 24px 24px 20px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .card-num {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          background: var(--gold-glow); border: 1px solid rgba(201,168,76,0.3);
          color: var(--gold); font-family: var(--font-d);
          font-weight: 700; font-size: 14px;
          display: flex; align-items: center; justify-content: center;
        }
        .chat-title { font-family: var(--font-d); font-weight: 600; font-size: 16px; margin-bottom: 3px; }
        .chat-sub { font-size: 12px; color: var(--text3); }

        .msgs {
          flex: 1; overflow-y: auto; padding: 20px 22px;
          display: flex; flex-direction: column; gap: 14px;
          scrollbar-width: thin; scrollbar-color: var(--border) transparent;
        }

        .empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 10px; text-align: center; padding: 40px 0;
        }
        .empty-icon {
          width: 52px; height: 52px; border-radius: 14px;
          background: var(--surface2); border: 1px solid var(--border2);
          display: flex; align-items: center; justify-content: center; color: var(--gold);
          margin-bottom: 4px;
        }
        .empty-title { font-size: 15px; font-weight: 500; color: var(--text2); }
        .empty-sub { font-size: 13px; color: var(--text3); }
        .chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 8px; }
        .chip {
          background: var(--surface2); border: 1px solid var(--border2);
          color: var(--text2); border-radius: 20px; padding: 7px 14px;
          font-size: 12.5px; cursor: pointer; font-family: var(--font-b);
          transition: all 0.15s;
        }
        .chip:hover { border-color: var(--gold); color: var(--gold); background: var(--gold-glow); }

        .msg { display: flex; gap: 10px; align-items: flex-start; animation: fadeUp 0.22s ease; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

        .avatar {
          width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; margin-top: 2px;
        }
        .msg-user .avatar { background: linear-gradient(135deg, var(--gold), var(--gold2)); color: #080c14; order: 2; margin-left: auto; }
        .msg-ai .avatar { background: var(--surface2); border: 1px solid var(--border2); color: var(--gold); }
        .msg-user { flex-direction: row-reverse; }
        .msg-user .msg-body { align-items: flex-end; }

        .msg-body { display: flex; flex-direction: column; gap: 4px; max-width: 78%; }
        .msg-text { padding: 11px 15px; border-radius: 13px; font-size: 14px; line-height: 1.68; }
        .msg-user .msg-text { background: linear-gradient(135deg, var(--gold), var(--gold2)); color: #080c14; font-weight: 500; border-bottom-right-radius: 4px; }
        .msg-ai .msg-text { background: var(--surface2); border: 1px solid var(--border); color: var(--text); border-bottom-left-radius: 4px; }
        .msg-err .msg-text { border-color: rgba(239,68,68,0.3); color: #f87171; }

        .msg-meta { display: flex; gap: 6px; font-size: 11px; color: var(--text3); padding: 0 2px; }

        .typing {
          display: flex; gap: 5px; align-items: center;
          padding: 13px 16px; background: var(--surface2);
          border: 1px solid var(--border); border-radius: 13px; border-bottom-left-radius: 4px;
        }
        .typing span { width: 6px; height: 6px; border-radius: 50%; background: var(--text3); animation: bounce 1.3s infinite; }
        .typing span:nth-child(2) { animation-delay: 0.18s; }
        .typing span:nth-child(3) { animation-delay: 0.36s; }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0);opacity:0.4} 40%{transform:translateY(-6px);opacity:1} }

        .input-row {
          padding: 14px 18px; border-top: 1px solid var(--border);
          display: flex; gap: 10px; align-items: center; flex-shrink: 0;
        }
        .input {
          flex: 1; background: var(--surface2);
          border: 1px solid var(--border2); border-radius: 12px;
          padding: 12px 16px; color: var(--text);
          font-family: var(--font-b); font-size: 14px; outline: none;
          transition: border-color 0.2s;
        }
        .input::placeholder { color: var(--text3); }
        .input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px var(--gold-glow); }
        .input:disabled { opacity: 0.4; cursor: not-allowed; }

        .send {
          width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
          background: linear-gradient(135deg, var(--gold), var(--gold2));
          border: none; color: #080c14; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; box-shadow: 0 4px 16px var(--gold-glow);
        }
        .send:hover:not(:disabled) { transform: scale(1.06); box-shadow: 0 6px 20px rgba(201,168,76,0.3); }
        .send:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }
      `}</style>
    </div>
  );
}