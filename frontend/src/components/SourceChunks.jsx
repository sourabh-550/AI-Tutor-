export default function SourceChunks({ sources, stats }) {
  if (!sources || sources.length === 0) {
    return (
      <div className="sidebar-card">
        <div className="sidebar-header">
          <h3 className="card-title">Context Sources</h3>
          <p className="card-sub">Chunks used to answer</p>
        </div>
        <div className="sidebar-empty">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p>Sources will appear here after you ask a question</p>
        </div>

        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="sidebar-card">
      <div className="sidebar-header">
        <div>
          <h3 className="card-title">Context Sources</h3>
          <p className="card-sub">Chunks used to answer</p>
        </div>
        <div className="stats-badges">
          <span className="badge badge-orange">{stats?.pruned} used</span>
          <span className="badge badge-gray">{stats?.total} found</span>
        </div>
      </div>

      {/* Pruning pipeline summary */}
      <div className="pipeline-row">
        <div className="pipeline-step">
          <span className="pip-num">{stats?.total}</span>
          <span className="pip-label">Retrieved</span>
        </div>
        <div className="pip-arrow">→</div>
        <div className="pipeline-step">
          <span className="pip-num">~{Math.round(stats?.total * 0.6)}</span>
          <span className="pip-label">Filtered</span>
        </div>
        <div className="pip-arrow">→</div>
        <div className="pipeline-step active">
          <span className="pip-num">{stats?.pruned}</span>
          <span className="pip-label">Used</span>
        </div>
      </div>

      <div className="chunks-list">
        {sources.map((s, i) => (
          <div key={i} className="chunk-card">
            <div className="chunk-header">
              <span className="chunk-rank">#{i + 1}</span>
              <div className="chunk-scores">
                <span className="score-tag">
                  <span className="score-dot faiss-dot" />
                  {s.similarity_score}
                </span>
                <span className="score-tag">
                  <span className="score-dot rerank-dot" />
                  {s.rerank_score}
                </span>
              </div>
            </div>
            <p className="chunk-text">{s.chunk}</p>
            <div className="chunk-bars">
              <div className="bar-row">
                <span className="bar-label">FAISS</span>
                <div className="bar-track">
                  <div className="bar-fill faiss-fill" style={{ width: `${Math.min(s.similarity_score * 100, 100)}%` }} />
                </div>
              </div>
              <div className="bar-row">
                <span className="bar-label">Rank</span>
                <div className="bar-track">
                  <div className="bar-fill rerank-fill" style={{ width: `${Math.min(Math.max((s.rerank_score + 10) / 20 * 100, 0), 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
  .sidebar-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }
  .sidebar-header {
    padding: 20px 20px 16px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 12px;
  }
  .card-title { font-family: var(--font-display); font-weight: 700; font-size: 15px; margin-bottom: 2px; }
  .card-sub { font-size: 12px; color: var(--text3); }

  .stats-badges { display: flex; gap: 6px; flex-shrink: 0; margin-top: 2px; }
  .badge {
    padding: 3px 8px; border-radius: 6px;
    font-size: 11px; font-weight: 600; font-family: monospace;
  }
  .badge-orange { background: var(--accent-glow); color: var(--accent); border: 1px solid var(--accent); }
  .badge-gray { background: var(--surface2); color: var(--text3); border: 1px solid var(--border); }

  .pipeline-row {
    display: flex; align-items: center; justify-content: center;
    gap: 8px; padding: 14px 20px;
    background: var(--surface2); border-bottom: 1px solid var(--border);
  }
  .pipeline-step {
    display: flex; flex-direction: column; align-items: center; gap: 2px;
  }
  .pipeline-step.active .pip-num { color: var(--accent); }
  .pip-num { font-family: var(--font-display); font-weight: 700; font-size: 16px; color: var(--text2); }
  .pip-label { font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; }
  .pip-arrow { color: var(--text3); font-size: 14px; }

  .sidebar-empty {
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    padding: 40px 20px; color: var(--text3); text-align: center;
  }
  .sidebar-empty p { font-size: 13px; line-height: 1.5; }

  .chunks-list {
    display: flex; flex-direction: column; gap: 1px;
    max-height: calc(100vh - 340px); overflow-y: auto;
    scrollbar-width: thin; scrollbar-color: var(--border) transparent;
  }

  .chunk-card {
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
  }
  .chunk-card:hover { background: var(--surface2); }
  .chunk-card:last-child { border-bottom: none; }

  .chunk-header {
    display: flex; align-items: center;
    justify-content: space-between; margin-bottom: 8px;
  }
  .chunk-rank {
    font-family: var(--font-display); font-weight: 700;
    font-size: 11px; color: var(--accent);
    background: var(--accent-glow); border: 1px solid var(--accent);
    padding: 2px 7px; border-radius: 5px;
  }
  .chunk-scores { display: flex; gap: 6px; }
  .score-tag {
    display: flex; align-items: center; gap: 4px;
    font-size: 11px; color: var(--text3); font-family: monospace;
  }
  .score-dot { width: 6px; height: 6px; border-radius: 50%; }
  .faiss-dot { background: #60a5fa; }
  .rerank-dot { background: var(--accent); }

  .chunk-text {
    font-size: 12px; line-height: 1.6; color: var(--text2);
    margin-bottom: 10px;
    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .chunk-bars { display: flex; flex-direction: column; gap: 5px; }
  .bar-row { display: flex; align-items: center; gap: 8px; }
  .bar-label { font-size: 10px; color: var(--text3); font-family: monospace; width: 28px; }
  .bar-track {
    flex: 1; height: 3px; background: var(--border);
    border-radius: 2px; overflow: hidden;
  }
  .bar-fill { height: 100%; border-radius: 2px; transition: width 0.5s ease; }
  .faiss-fill { background: #60a5fa; }
  .rerank-fill { background: var(--accent); }
`;