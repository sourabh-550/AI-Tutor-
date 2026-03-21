import { useState } from "react";
import UploadPanel from "./components/UploadPanel";
import ChatPanel from "./components/ChatPanel";
import SourceChunks from "./components/SourceChunks";
import QuizPage from "./components/QuizPage";

export default function App() {
  const [pdfReady, setPdfReady] = useState(false);
  const [sources, setSources] = useState([]);
  const [stats, setStats] = useState(null);
  const [filename, setFilename] = useState("");
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="root">
      <div className="noise" />
      <div className="ambient-1" />
      <div className="ambient-2" />

      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-mark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="logo-name">VidyaAI</span>
          </div>

          <nav className="nav">
            <span className="nav-item">RAG Pipeline</span>
            <span className="nav-dot" />
            <span className="nav-item">FAISS Search</span>
            <span className="nav-dot" />
            <span className="nav-item">Groq LLM</span>
          </nav>

          {pdfReady && (
            <div className="doc-pill">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>{filename}</span>
              <span className="pill-dot" />
            </div>
          )}
        </div>
      </header>

      <main className="main">
        {!pdfReady ? (
          <div className="landing">
            <div className="landing-left">
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                AI-Powered Education
              </div>
              <h1 className="hero-title">
                Your Personal<br />
                <em>Study Companion</em>
              </h1>
              <p className="hero-desc">
                Transform any textbook into an intelligent tutor. Upload your PDF, ask questions in plain language, and receive precise answers drawn directly from your material.
              </p>
              <div className="features">
                {[
                  { icon: "⚡", label: "Instant answers from your documents" },
                  { icon: "🎯", label: "Context-pruned for accuracy" },
                  { icon: "🔒", label: "Your data stays private" },
                ].map((f, i) => (
                  <div className="feature" key={i} style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                    <span className="feature-icon">{f.icon}</span>
                    <span>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="landing-right">
              <UploadPanel onSuccess={(name) => { setFilename(name); setPdfReady(true); }} />
            </div>
          </div>
        ) : (
          <div className="workspace-root">

            {/* TABS */}
            <div className="tabs">
              <button
                className={`tab ${activeTab === "chat" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("chat")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Chat
              </button>
              <button
                className={`tab ${activeTab === "quiz" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("quiz")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
                  <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Quiz
              </button>
            </div>

            {/* CHAT TAB */}
            {activeTab === "chat" && (
              <div className="workspace">
                <div className="ws-chat">
                  <ChatPanel onAnswer={(src, st) => { setSources(src); setStats(st); }} />
                </div>
                <div className="ws-sidebar">
                  <SourceChunks sources={sources} stats={stats} />
                </div>
              </div>
            )}

            {/* QUIZ TAB */}
            {activeTab === "quiz" && (
              <div className="quiz-page">
                <QuizPage />
              </div>
            )}

          </div>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #080c14;
          --surface: rgba(255,255,255,0.03);
          --surface2: rgba(255,255,255,0.055);
          --border: rgba(255,255,255,0.07);
          --border2: rgba(255,255,255,0.11);
          --gold: #c9a84c;
          --gold2: #e8c97a;
          --gold-glow: rgba(201,168,76,0.15);
          --text: #f0ede8;
          --text2: #9896a4;
          --text3: #45434f;
          --green: #4ade80;
          --r: 18px;
          --font-d: 'Playfair Display', serif;
          --font-b: 'Outfit', sans-serif;
        }

        body { background: var(--bg); color: var(--text); font-family: var(--font-b); -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        .root { min-height: 100vh; position: relative; }

        .noise {
          position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }
        .ambient-1 { position: fixed; top: -250px; right: -150px; width: 650px; height: 650px; border-radius: 50%; background: radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 65%); pointer-events: none; z-index: 0; }
        .ambient-2 { position: fixed; bottom: -250px; left: -150px; width: 550px; height: 550px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 65%); pointer-events: none; z-index: 0; }

        .header { position: sticky; top: 0; z-index: 100; border-bottom: 1px solid var(--border); background: rgba(8,12,20,0.85); backdrop-filter: blur(28px); }
        .header-inner { max-width: 1280px; margin: 0 auto; padding: 0 32px; height: 64px; display: flex; align-items: center; gap: 24px; }
        .logo { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .logo-mark { width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg, var(--gold), var(--gold2)); color: #080c14; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 24px var(--gold-glow); }
        .logo-name { font-family: var(--font-d); font-weight: 700; font-size: 20px; letter-spacing: -0.3px; }
        .nav { flex: 1; display: flex; align-items: center; justify-content: center; gap: 14px; }
        .nav-item { font-size: 11.5px; color: var(--text3); font-weight: 500; letter-spacing: 0.4px; }
        .nav-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--text3); opacity: 0.5; }
        .doc-pill { display: flex; align-items: center; gap: 7px; background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.2); border-radius: 20px; padding: 5px 12px; font-size: 12px; color: var(--green); font-weight: 500; max-width: 200px; flex-shrink: 0; overflow: hidden; }
        .doc-pill span:nth-child(2) { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pill-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); flex-shrink: 0; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }

        .main { position: relative; z-index: 1; max-width: 1280px; margin: 0 auto; padding: 0 32px; }

        .landing { display: grid; grid-template-columns: 1fr 460px; gap: 80px; align-items: center; min-height: calc(100vh - 64px); padding: 80px 0; }
        @media(max-width:900px){ .landing { grid-template-columns:1fr; gap:48px; padding:48px 0; } }

        .eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: var(--gold); margin-bottom: 22px; }
        .eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); box-shadow: 0 0 10px var(--gold); }
        .hero-title { font-family: var(--font-d); font-size: clamp(44px, 5.5vw, 70px); line-height: 1.08; letter-spacing: -1.5px; margin-bottom: 22px; animation: fadeUp 0.6s ease both; }
        .hero-title em { font-style: italic; background: linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-desc { font-size: 15.5px; line-height: 1.78; color: var(--text2); font-weight: 300; max-width: 420px; margin-bottom: 36px; animation: fadeUp 0.6s 0.1s ease both; }
        .features { display: flex; flex-direction: column; gap: 12px; }
        .feature { display: flex; align-items: center; gap: 12px; font-size: 14px; color: var(--text2); animation: fadeUp 0.5s ease both; }
        .feature-icon { width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0; background: var(--surface2); border: 1px solid var(--border2); display: flex; align-items: center; justify-content: center; font-size: 15px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

        /* TABS */
        .workspace-root { padding: 0; }
        .tabs {
          display: flex; gap: 4px;
          padding: 20px 0 0;
          border-bottom: 1px solid var(--border);
          margin-bottom: 0;
        }
        .tab {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 22px; border-radius: 12px 12px 0 0;
          background: transparent;
          border: 1px solid transparent;
          border-bottom: none;
          color: var(--text3); font-family: var(--font-b);
          font-size: 14px; font-weight: 500; cursor: pointer;
          transition: all 0.15s; margin-bottom: -1px;
        }
        .tab:hover { color: var(--text2); background: var(--surface); }
        .tab-active {
          background: #080c14 !important;
          border-color: var(--border2) !important;
          border-bottom-color: #080c14 !important;
          color: var(--gold) !important;
        }

        /* WORKSPACE */
        .workspace { display: grid; grid-template-columns: 1fr 360px; gap: 18px; padding: 24px 0; min-height: calc(100vh - 130px); align-items: start; }
        @media(max-width:900px){ .workspace{grid-template-columns:1fr} .ws-sidebar{order:-1} }
        .ws-chat { position: sticky; top: 84px; }
        .ws-sidebar { position: sticky; top: 84px; }

        .quiz-page { padding: 24px 0; min-height: calc(100vh - 130px); }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }
      `}</style>
    </div>
  );
}