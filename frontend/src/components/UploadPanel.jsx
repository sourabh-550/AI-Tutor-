import { useState, useRef } from "react";
import axios from "axios";

export default function UploadPanel({ onSuccess }) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
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
    setStatus("processing:");

    // Fake progress bar
    const interval = setInterval(() => {
      setProgress(p => p < 85 ? p + Math.random() * 12 : p);
    }, 300);

    try {
      const res = await axios.post("https://vidya-ai-backend.onrender.com", formData);
      clearInterval(interval);
      setProgress(100);
      setStatus(`success:${res.data.filename} — ${res.data.chunks_created} chunks indexed`);
      setTimeout(() => onSuccess(res.data.filename), 800);
    } catch (err) {
      clearInterval(interval);
      setStatus("error:" + (err.response?.data?.detail || "Upload failed"));
    } finally {
      setLoading(false);
    }
  };

  const statusType = status.split(":")[0];
  const statusMsg = status.split(":").slice(1).join(":");

  return (
    <div className="upload-card">
      <div className="upload-card-header">
        <div className="step-badge">01</div>
        <div>
          <h3 className="card-title">Upload Textbook</h3>
          <p className="card-sub">PDF format, any size</p>
        </div>
      </div>

      <div
        className={`drop-zone ${dragOver ? "drag-active" : ""} ${loading ? "loading" : ""}`}
        onClick={() => !loading && inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={e => handleFile(e.target.files[0])}
        />

        {loading ? (
          <div className="drop-loading">
            <div className="spinner" />
            <p>Processing PDF...</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="progress-num">{Math.round(progress)}%</span>
          </div>
        ) : (
          <div className="drop-idle">
            <div className="drop-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="18" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <polyline points="9 15 12 12 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="drop-title">Drop PDF here</p>
            <p className="drop-sub">or click to browse</p>
          </div>
        )}
      </div>

      {statusMsg && (
        <div className={`status-msg status-${statusType}`}>
          {statusType === "success" && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {statusType === "error" && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
          {statusMsg}
        </div>
      )}

      <style>{`
        .upload-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 28px;
        }
        .upload-card-header {
          display: flex; align-items: flex-start; gap: 14px; margin-bottom: 20px;
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

        .drop-zone {
          border: 1.5px dashed var(--border2);
          border-radius: 12px; padding: 40px 20px;
          cursor: pointer; transition: all 0.2s;
          text-align: center;
        }
        .drop-zone:hover, .drop-zone.drag-active {
          border-color: var(--accent);
          background: var(--accent-glow);
        }
        .drop-zone.loading { cursor: default; pointer-events: none; }

        .drop-icon {
          width: 56px; height: 56px; border-radius: 14px;
          background: var(--surface2); border: 1px solid var(--border2);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 14px; color: var(--accent);
        }
        .drop-title { font-weight: 500; font-size: 15px; margin-bottom: 4px; }
        .drop-sub { font-size: 13px; color: var(--text3); }

        .drop-loading { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .drop-loading p { font-size: 14px; color: var(--text2); }
        .spinner {
          width: 32px; height: 32px; border-radius: 50%;
          border: 2px solid var(--border2);
          border-top-color: var(--accent);
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .progress-bar {
          width: 200px; height: 4px;
          background: var(--border); border-radius: 4px; overflow: hidden;
        }
        .progress-fill {
          height: 100%; background: var(--accent);
          border-radius: 4px; transition: width 0.3s ease;
        }
        .progress-num { font-size: 12px; color: var(--text3); font-family: monospace; }

        .status-msg {
          display: flex; align-items: center; gap: 8px;
          margin-top: 14px; padding: 10px 14px;
          border-radius: 8px; font-size: 13px; font-weight: 500;
        }
        .status-success {
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.2);
          color: #4ade80;
        }
        .status-error {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          color: #f87171;
        }
        .status-processing { color: var(--text2); }
      `}</style>
    </div>
  );
}