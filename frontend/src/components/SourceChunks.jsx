export default function SourceChunks({ sources, stats }) {
  return (
    <div className="sidebar">
      <div className="sb-head">
        <div>
          <h3 className="sb-title">Evidence</h3>
          <p className="sb-sub">Passages used to answer</p>
        </div>
        {stats && (
          <div className="sb-badges">
            <span className="badge gold">{stats.pruned} used</span>
            <span className="badge gray">{stats.total} found</span>
          </div>
        )}
      </div>

      {stats && (
        <div className="pipeline">
          <div className="pip-step">
            <span className="pip-n">{stats.total}</span>
            <span className="pip-l">Retrieved</span>
          </div>
          <div className="pip-arr">→</div>
          <div className="pip-step">
            <span className="pip-n">~{Math.round(stats.total * 0.55)}</span>
            <span className="pip-l">Filtered</span>
          </div>
          <div className="pip-arr">→</div>
          <div className="pip-step active">
            <span className="pip-n">{stats.pruned}</span>
            <span className="pip-l">Used</span>
          </div>
        </div>
      )}

      <div className="chunks">
        {!sources || sources.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p>Source passages appear here after your first question</p>
          </div>
        ) : (
          sources.map((s, i) => (
            <div className="chunk" key={i}>
              <div className="chunk-top">
                <span className="chunk-rank">#{i + 1}</span>
                <div className="chunk-scores">
                  <span className="score"><span className="sdot blue" />{s.similarity_score}</span>
                  <span className="score"><span className="sdot gold" />{s.rerank_score}</span>
                </div>
              </div>
              <p className="chunk-text">{s.chunk}</p>
              <div className="bars">
                <div className="bar-row">
                  <span className="bar-l">FAISS</span>
                  <div className="bar-t"><div className="bar-f blue-f" style={{ width:`${Math.min(s.similarity_score*100,100)}%` }} /></div>
                </div>
                <div className="bar-row">
                  <span className="bar-l">Rank</span>
                  <div className="bar-t"><div className="bar-f gold-f" style={{ width:`${Math.min(Math.max((s.rerank_score+10)/20*100,0),100)}%` }} /></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .sidebar {
          background: var(--surface);
          border: 1px solid var(--border2);
          border-radius: var(--r);
          overflow: hidden;
          backdrop-filter: blur(12px);
          box-shadow: 0 24px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .sb-head {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 20px 20px 16px; border-bottom: 1px solid var(--border);
        }
        .sb-title { font-family: var(--font-d); font-weight: 600; font-size: 15px; margin-bottom: 3px; }
        .sb-sub { font-size: 12px; color: var(--text3); }
        .sb-badges { display: flex; gap: 6px; flex-shrink: 0; margin-top: 2px; }
        .badge { padding: 3px 9px; border-radius: 6px; font-size: 11px; font-weight: 600; font-family: monospace; }
        .badge.gold { background: var(--gold-glow); color: var(--gold); border: 1px solid rgba(201,168,76,0.3); }
        .badge.gray { background: var(--surface2); color: var(--text3); border: 1px solid var(--border); }

        .pipeline {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 14px 20px; background: var(--surface2); border-bottom: 1px solid var(--border);
        }
        .pip-step { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .pip-n { font-family: var(--font-d); font-weight: 700; font-size: 17px; color: var(--text3); }
        .pip-step.active .pip-n { color: var(--gold); }
        .pip-l { font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; }
        .pip-arr { color: var(--text3); font-size: 13px; opacity: 0.5; }

        .chunks {
          max-height: calc(100vh - 320px); overflow-y: auto;
          scrollbar-width: thin; scrollbar-color: var(--border) transparent;
        }

        .empty {
          display: flex; flex-direction: column; align-items: center;
          gap: 10px; padding: 40px 20px; color: var(--text3); text-align: center;
        }
        .empty-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: var(--surface2); border: 1px solid var(--border2);
          display: flex; align-items: center; justify-content: center; color: var(--gold);
        }
        .empty p { font-size: 13px; line-height: 1.6; max-width: 200px; }

        .chunk {
          padding: 14px 18px; border-bottom: 1px solid var(--border);
          transition: background 0.15s;
        }
        .chunk:hover { background: var(--surface2); }
        .chunk:last-child { border-bottom: none; }

        .chunk-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .chunk-rank {
          font-family: var(--font-d); font-weight: 700; font-size: 11px; color: var(--gold);
          background: var(--gold-glow); border: 1px solid rgba(201,168,76,0.25);
          padding: 2px 8px; border-radius: 5px;
        }
        .chunk-scores { display: flex; gap: 8px; }
        .score { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text3); font-family: monospace; }
        .sdot { width: 5px; height: 5px; border-radius: 50%; }
        .sdot.blue { background: #60a5fa; }
        .sdot.gold { background: var(--gold); }

        .chunk-text {
          font-size: 12.5px; line-height: 1.62; color: var(--text2); margin-bottom: 10px;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }

        .bars { display: flex; flex-direction: column; gap: 5px; }
        .bar-row { display: flex; align-items: center; gap: 8px; }
        .bar-l { font-size: 10px; color: var(--text3); font-family: monospace; width: 28px; flex-shrink: 0; }
        .bar-t { flex: 1; height: 3px; background: var(--border); border-radius: 3px; overflow: hidden; }
        .bar-f { height: 100%; border-radius: 3px; transition: width 0.6s ease; }
        .blue-f { background: #60a5fa; }
        .gold-f { background: linear-gradient(90deg, var(--gold), var(--gold2)); }
      `}</style>
    </div>
  );
}