import { useState } from "react";
import UploadPanel from "./components/UploadPanel";
import ChatPanel from "./components/ChatPanel";
import SourceChunks from "./components/SourceChunks";

export default function App() {
  const [pdfReady, setPdfReady] = useState(false);
  const [sources, setSources] = useState([]);
  const [stats, setStats] = useState(null);
  const [filename, setFilename] = useState("");

  return (
    <div className="app-root">
      {/* Background grid */}
      <div className="bg-grid" />
      <div className="bg-glow" />

      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="logo-text">VidyaAI</span>
            <span className="logo-badge">BETA</span>
          </div>
          <div className="header-right">
            <span className="header-tag">RAG · FAISS · Groq</span>
            {pdfReady && (
              <div className="status-pill">
                <span className="status-dot" />
                {filename}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="main">
        {!pdfReady ? (
          <div className="landing">
            <div className="landing-text">
              <h1 className="hero-title">
                AI Tutor for<br />
                <span className="hero-accent">Every Student</span>
              </h1>
              <p className="hero-sub">
                Upload your textbook. Ask anything. Get instant, accurate answers powered by context-aware AI — built for India's remote learners.
              </p>
              <div className="hero-stats">
                <div className="stat"><span>RAG</span><label>Architecture</label></div>
                <div className="stat-div" />
                <div className="stat"><span>FAISS</span><label>Vector Search</label></div>
                <div className="stat-div" />
                <div className="stat"><span>Free</span><label>100% Open Source</label></div>
              </div>
            </div>
            <div className="upload-wrapper">
              <UploadPanel onSuccess={(name) => { setFilename(name); setPdfReady(true); }} />
            </div>
          </div>
        ) : (
          <div className="chat-layout">
            <div className="chat-main">
              <ChatPanel onAnswer={(src, st) => { setSources(src); setStats(st); }} />
            </div>
            <div className="chat-sidebar">
              <SourceChunks sources={sources} stats={stats} />
            </div>
          </div>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0a0a0f;
          --surface: #111118;
          --surface2: #16161f;
          --border: rgba(255,255,255,0.07);
          --border2: rgba(255,255,255,0.12);
          --accent: #f97316;
          --accent2: #fb923c;
          --accent-glow: rgba(249,115,22,0.15);
          --text: #f1f0ee;
          --text2: #9998a8;
          --text3: #5a596a;
          --green: #22c55e;
          --radius: 16px;
          --font-display: 'Syne', sans-serif;
          --font-body: 'DM Sans', sans-serif;
        }

        body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

        .app-root { min-height: 100vh; position: relative; overflow-x: hidden; }

        .bg-grid {
          position: fixed; inset: 0; z-index: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        .bg-glow {
          position: fixed; top: -200px; left: 50%; transform: translateX(-50%);
          width: 800px; height: 500px; z-index: 0;
          background: radial-gradient(ellipse, rgba(249,115,22,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        /* HEADER */
        .header {
          position: sticky; top: 0; z-index: 100;
          border-bottom: 1px solid var(--border);
          background: rgba(10,10,15,0.85);
          backdrop-filter: blur(20px);
        }
        .header-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 24px; height: 60px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .logo { display: flex; align-items: center; gap: 10px; }
        .logo-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: var(--accent); color: #fff;
          display: flex; align-items: center; justify-content: center;
        }
        .logo-text {
          font-family: var(--font-display); font-weight: 800;
          font-size: 18px; letter-spacing: -0.5px;
        }
        .logo-badge {
          font-size: 10px; font-weight: 600; letter-spacing: 1px;
          background: var(--accent-glow); color: var(--accent);
          border: 1px solid var(--accent); border-radius: 4px;
          padding: 2px 6px;
        }
        .header-right { display: flex; align-items: center; gap: 12px; }
        .header-tag {
          font-size: 12px; color: var(--text3); font-family: monospace;
          letter-spacing: 0.5px;
        }
        .status-pill {
          display: flex; align-items: center; gap: 6px;
          background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25);
          border-radius: 20px; padding: 4px 12px;
          font-size: 12px; color: var(--green); font-weight: 500;
          max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .status-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--green); flex-shrink: 0;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* MAIN */
        .main { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 0 24px; }

        /* LANDING */
        .landing {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: center; min-height: calc(100vh - 60px);
          padding: 60px 0;
        }
        @media (max-width: 768px) {
          .landing { grid-template-columns: 1fr; gap: 40px; padding: 40px 0; }
        }
        .hero-title {
          font-family: var(--font-display); font-weight: 800;
          font-size: clamp(40px, 5vw, 64px); line-height: 1.05;
          letter-spacing: -2px; margin-bottom: 20px;
        }
        .hero-accent {
          background: linear-gradient(135deg, var(--accent), #fbbf24);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .hero-sub {
          font-size: 16px; line-height: 1.7; color: var(--text2);
          font-weight: 300; max-width: 420px; margin-bottom: 40px;
        }
        .hero-stats { display: flex; align-items: center; gap: 20px; }
        .stat { display: flex; flex-direction: column; gap: 2px; }
        .stat span { font-family: var(--font-display); font-weight: 700; font-size: 18px; color: var(--accent); }
        .stat label { font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-div { width: 1px; height: 32px; background: var(--border2); }

        /* CHAT LAYOUT */
        .chat-layout {
          display: grid; grid-template-columns: 1fr 380px;
          gap: 24px; padding: 24px 0; min-height: calc(100vh - 60px);
          align-items: start;
        }
        @media (max-width: 900px) {
          .chat-layout { grid-template-columns: 1fr; }
          .chat-sidebar { order: -1; }
        }
        .chat-main { position: sticky; top: 84px; }
        .chat-sidebar { position: sticky; top: 84px; }
      `}</style>
    </div>
  );
}