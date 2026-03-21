import { useState, useRef } from "react";
import axios from "axios";

export default function UploadPanel({ onSuccess }) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.name.endsWith(".pdf")) {
      setStatus("error:Only PDF files are supported.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setProgress(0);
    setStatus("loading:");

    const iv = setInterval(() => setProgress(p => p < 82 ? p + Math.random() * 5 : p), 400);

    try {
      const res = await axios.post("https://vidya-ai-backend.onrender.com/upload", formData, {timeout: 120000});
      clearInterval(iv);
      setProgress(100);
      setStatus(`ok:${res.data.filename} · ${res.data.chunks_created} passages indexed`);
      setTimeout(() => onSuccess(res.data.filename), 900);
    } catch (err) {
      clearInterval(iv);
      setStatus("error:" + (err.response?.data?.detail || "Upload failed. Try again."));
    } finally {
      setLoading(false);
    }
  };

  const type = status.split(":")[0];
  const msg = status.split(":").slice(1).join(":");

  return (
    <div className="card">
      <div className="card-top">
        <div className="card-num">01</div>
        <div>
          <h3 className="card-title">Upload Document</h3>
          <p className="card-sub">PDF — any size, any subject</p>
        </div>
      </div>

      <div
        className={`drop ${drag ? "drag" : ""} ${loading ? "busy" : ""}`}
        onClick={() => !loading && inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
      >
        <input ref={inputRef} type="file" accept=".pdf" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />

        {loading ? (
          <div className="drop-loading">
            <div className="ring" />
            <p className="loading-text">Processing document<span className="dots"><span>.</span><span>.</span><span>.</span></span></p>
            <div className="prog-track"><div className="prog-fill" style={{ width:`${progress}%` }} /></div>
            <span className="prog-pct">{Math.round(progress)}%</span>
          </div>
        ) : (
          <div className="drop-idle">
            <div className="drop-icon-wrap">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="18" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <polyline points="9 15 12 12 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="drop-title">Drop your PDF here</p>
            <p className="drop-hint">or click to browse files</p>
          </div>
        )}
      </div>

      {msg && (
        <div className={`status ${type}`}>
          {type === "ok" && (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {type === "error" && (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1" fill="currentColor"/>
            </svg>
          )}
          <span>{msg}</span>
        </div>
      )}

      <style>{`
        .card {
          background: var(--surface);
          border: 1px solid var(--border2);
          border-radius: var(--r);
          padding: 28px;
          backdrop-filter: blur(12px);
          box-shadow: 0 24px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .card-top { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 22px; }
        .card-num {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          background: var(--gold-glow); border: 1px solid rgba(201,168,76,0.3);
          color: var(--gold); font-family: var(--font-d);
          font-weight: 700; font-size: 14px;
          display: flex; align-items: center; justify-content: center;
        }
        .card-title { font-family: var(--font-d); font-weight: 600; font-size: 16px; margin-bottom: 3px; }
        .card-sub { font-size: 12px; color: var(--text3); font-weight: 400; }

        .drop {
          border: 1.5px dashed var(--border2);
          border-radius: 14px; padding: 44px 24px;
          text-align: center; cursor: pointer;
          transition: all 0.2s ease;
        }
        .drop:hover, .drop.drag {
          border-color: var(--gold);
          background: var(--gold-glow);
        }
        .drop.busy { cursor: default; pointer-events: none; }

        .drop-icon-wrap {
          width: 60px; height: 60px; border-radius: 16px; margin: 0 auto 16px;
          background: var(--surface2); border: 1px solid var(--border2);
          display: flex; align-items: center; justify-content: center;
          color: var(--gold); transition: transform 0.2s;
        }
        .drop:hover .drop-icon-wrap { transform: translateY(-3px); }
        .drop-title { font-weight: 500; font-size: 15px; margin-bottom: 5px; color: var(--text); }
        .drop-hint { font-size: 13px; color: var(--text3); }

        .drop-loading { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .ring {
          width: 36px; height: 36px; border-radius: 50%;
          border: 2px solid var(--border2);
          border-top-color: var(--gold);
          animation: spin 0.9s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-text { font-size: 14px; color: var(--text2); }
        .dots span { animation: blink 1.4s infinite; }
        .dots span:nth-child(2) { animation-delay: 0.2s; }
        .dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink { 0%,80%,100%{opacity:0} 40%{opacity:1} }

        .prog-track { width: 180px; height: 3px; background: var(--border); border-radius: 3px; overflow: hidden; }
        .prog-fill { height: 100%; background: linear-gradient(90deg, var(--gold), var(--gold2)); border-radius: 3px; transition: width 0.4s ease; }
        .prog-pct { font-size: 11px; color: var(--text3); font-family: monospace; }

        .status {
          display: flex; align-items: center; gap: 8px;
          margin-top: 14px; padding: 10px 14px;
          border-radius: 10px; font-size: 13px; font-weight: 500;
        }
        .status.ok { background: rgba(74,222,128,0.07); border: 1px solid rgba(74,222,128,0.2); color: #4ade80; }
        .status.error { background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.2); color: #f87171; }
      `}</style>
    </div>
  );
}