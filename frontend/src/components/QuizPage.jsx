import { useState } from "react";
import axios from "axios";

export default function QuizPage() {
  const [topic, setTopic] = useState("");
  const [numQ, setNumQ] = useState(10);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const generate = async () => {
    setLoading(true);
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    try {
      const res = await axios.post("https://vidya-ai-backend.onrender.com/quiz", {
        topic,
        num_questions: numQ
      });
      setQuestions(res.data.questions);
    } catch {
      alert("Failed to generate quiz. Make sure PDF is uploaded.");
    } finally {
      setLoading(false);
    }
  };

  const select = (qi, opt) => {
    if (submitted) return;
    setAnswers(p => ({ ...p, [qi]: opt }));
  };

  const submit = () => {
    let s = 0;
    questions.forEach((q, i) => { if (answers[i] === q.correct) s++; });
    setScore(s);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setTopic("");
  };

  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;
  const pct = Math.round((score / questions.length) * 100);

  return (
    <div className="qp">
      <div className="qp-header">
        <div className="qp-title-wrap">
          <div className="qp-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h2 className="qp-title">Quiz Generator</h2>
            <p className="qp-sub">Auto-generated from your uploaded document</p>
          </div>
        </div>
      </div>

      {/* Score */}
      {submitted && (
        <div className={`score-card ${pct >= 70 ? "good" : "bad"}`}>
          <div className="score-left">
            <div className="score-circle">
              <span className="score-pct">{pct}%</span>
            </div>
          </div>
          <div className="score-right">
            <p className="score-msg">
              {pct === 100 ? "Perfect Score! 🎉" :
               pct >= 70 ? "Great Job! 👍" :
               pct >= 40 ? "Keep Practicing 📚" : "Review the material 💪"}
            </p>
            <p className="score-detail">{score} correct out of {questions.length} questions</p>
            <div className="score-bar-track">
              <div className="score-bar-fill" style={{ width: `${pct}%`, background: pct >= 70 ? "#4ade80" : "#f87171" }} />
            </div>
          </div>
          <button className="retry-btn" onClick={reset}>New Quiz</button>
        </div>
      )}

      {/* Controls */}
      {questions.length === 0 && !loading && (
        <div className="qp-controls">
          <div className="ctrl-grid">
            <div className="ctrl-group">
              <label className="ctrl-lbl">Topic (optional)</label>
              <input
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === "Enter" && generate()}
                placeholder="e.g. Photosynthesis, Gravity, Chapter 3..."
                className="ctrl-inp"
              />
            </div>
            <div className="ctrl-group">
              <label className="ctrl-lbl">Questions</label>
              <div className="num-btns">
                {[5, 10, 15].map(n => (
                  <button key={n} className={`nbtn ${numQ === n ? "active" : ""}`} onClick={() => setNumQ(n)}>{n}</button>
                ))}
              </div>
            </div>
          </div>
          <button className="gen-btn" onClick={generate}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>
            </svg>
            Generate Quiz
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="qp-loading">
          <div className="qp-ring" />
          <p>Generating {numQ} questions from your document...</p>
        </div>
      )}

      {/* Questions */}
      {questions.length > 0 && (
        <div className="qp-questions">
          <div className="qp-meta">
            <span>{questions.length} questions</span>
            {!submitted && <span>{Object.keys(answers).length} answered</span>}
            <button className="new-btn" onClick={reset}>← New Quiz</button>
          </div>

          {questions.map((q, qi) => (
            <div key={qi} className={`qcard ${submitted ? (answers[qi] === q.correct ? "qcorrect" : "qwrong") : ""}`}>
              <div className="qcard-top">
                <span className="qnum">Q{qi + 1}</span>
                <span className={`qtype ${q.type}`}>{q.type === "mcq" ? "MCQ" : "True / False"}</span>
                {submitted && (
                  <span className={`qresult ${answers[qi] === q.correct ? "res-ok" : "res-bad"}`}>
                    {answers[qi] === q.correct ? "✓ Correct" : "✗ Wrong"}
                  </span>
                )}
              </div>
              <p className="qtext">{q.question}</p>
              <div className="qopts">
                {q.options.map((opt, oi) => {
                  let cls = "qopt";
                  if (answers[qi] === opt) cls += " qselected";
                  if (submitted && opt === q.correct) cls += " qcorrect-opt";
                  if (submitted && answers[qi] === opt && opt !== q.correct) cls += " qwrong-opt";
                  return (
                    <button key={oi} className={cls} onClick={() => select(qi, opt)}>
                      <span className="opt-bullet">{String.fromCharCode(65 + oi)}</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <div className="qexp">
                  <span>💡</span>
                  <span>{q.explanation}</span>
                </div>
              )}
            </div>
          ))}

          {!submitted && (
            <button className="submit-btn" disabled={!allAnswered} onClick={submit}>
              Submit Quiz · {Object.keys(answers).length}/{questions.length} answered
            </button>
          )}
          {submitted && (
            <button className="gen-btn" onClick={reset}>Generate New Quiz</button>
          )}
        </div>
      )}

      <style>{`
        .qp { max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; padding-bottom: 60px; }

        .qp-header { display: flex; align-items: center; justify-content: space-between; }
        .qp-title-wrap { display: flex; align-items: center; gap: 14px; }
        .qp-icon { width: 44px; height: 44px; border-radius: 12px; background: var(--gold-glow); border: 1px solid rgba(201,168,76,0.3); color: var(--gold); display: flex; align-items: center; justify-content: center; }
        .qp-title { font-family: var(--font-d); font-weight: 700; font-size: 20px; margin-bottom: 3px; }
        .qp-sub { font-size: 13px; color: var(--text3); }

        .score-card { display: flex; align-items: center; gap: 20px; padding: 24px; border-radius: 16px; flex-wrap: wrap; }
        .score-card.good { background: rgba(74,222,128,0.07); border: 1px solid rgba(74,222,128,0.2); }
        .score-card.bad { background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.2); }
        .score-circle { width: 72px; height: 72px; border-radius: 50%; background: var(--surface2); border: 2px solid var(--gold); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .score-pct { font-family: var(--font-d); font-weight: 700; font-size: 18px; color: var(--gold); }
        .score-right { flex: 1; display: flex; flex-direction: column; gap: 6px; }
        .score-msg { font-size: 16px; font-weight: 600; color: var(--text); }
        .score-detail { font-size: 13px; color: var(--text2); }
        .score-bar-track { height: 4px; background: var(--border); border-radius: 4px; overflow: hidden; margin-top: 4px; }
        .score-bar-fill { height: 100%; border-radius: 4px; transition: width 1s ease; }
        .retry-btn { background: var(--surface2); border: 1px solid var(--border2); color: var(--text2); border-radius: 10px; padding: 10px 18px; font-size: 13px; cursor: pointer; font-family: var(--font-b); transition: all 0.15s; flex-shrink: 0; }
        .retry-btn:hover { border-color: var(--gold); color: var(--gold); }

        .qp-controls { background: var(--surface); border: 1px solid var(--border2); border-radius: 18px; padding: 28px; display: flex; flex-direction: column; gap: 20px; backdrop-filter: blur(12px); box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
        .ctrl-grid { display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: end; }
        @media(max-width:600px){ .ctrl-grid{grid-template-columns:1fr} }
        .ctrl-group { display: flex; flex-direction: column; gap: 8px; }
        .ctrl-lbl { font-size: 11px; font-weight: 600; color: var(--text2); letter-spacing: 1px; text-transform: uppercase; }
        .ctrl-inp { background: var(--surface2); border: 1px solid var(--border2); border-radius: 10px; padding: 12px 14px; color: var(--text); font-family: var(--font-b); font-size: 14px; outline: none; transition: border-color 0.2s; min-width: 300px; }
        .ctrl-inp::placeholder { color: var(--text3); }
        .ctrl-inp:focus { border-color: var(--gold); }
        .num-btns { display: flex; gap: 8px; }
        .nbtn { width: 48px; height: 44px; border-radius: 10px; background: var(--surface2); border: 1px solid var(--border2); color: var(--text2); font-family: var(--font-b); font-size: 14px; cursor: pointer; transition: all 0.15s; }
        .nbtn.active { background: var(--gold-glow); border-color: var(--gold); color: var(--gold); font-weight: 600; }
        .nbtn:hover:not(.active) { color: var(--text); }

        .gen-btn { display: flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, var(--gold), var(--gold2)); border: none; border-radius: 12px; padding: 14px 24px; color: #080c14; font-family: var(--font-b); font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.15s; box-shadow: 0 4px 20px var(--gold-glow); width: 100%; }
        .gen-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(201,168,76,0.3); }

        .qp-loading { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 60px 0; }
        .qp-ring { width: 44px; height: 44px; border-radius: 50%; border: 2px solid var(--border2); border-top-color: var(--gold); animation: spin 0.9s linear infinite; }
        @keyframes spin{to{transform:rotate(360deg)}}
        .qp-loading p { font-size: 14px; color: var(--text2); }

        .qp-questions { display: flex; flex-direction: column; gap: 14px; }
        .qp-meta { display: flex; align-items: center; gap: 12px; padding: 0 2px; font-size: 13px; color: var(--text3); margin-bottom: 4px; }
        .new-btn { margin-left: auto; background: none; border: 1px solid var(--border); color: var(--text3); border-radius: 8px; padding: 5px 12px; font-size: 12px; cursor: pointer; font-family: var(--font-b); transition: all 0.15s; }
        .new-btn:hover { border-color: var(--gold); color: var(--gold); }

        .qcard { background: var(--surface); border: 1px solid var(--border2); border-radius: 16px; padding: 20px; transition: border-color 0.2s; backdrop-filter: blur(8px); }
        .qcard.qcorrect { border-color: rgba(74,222,128,0.35); background: rgba(74,222,128,0.03); }
        .qcard.qwrong { border-color: rgba(239,68,68,0.35); background: rgba(239,68,68,0.03); }

        .qcard-top { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
        .qnum { font-family: var(--font-d); font-weight: 700; font-size: 12px; color: var(--gold); background: var(--gold-glow); border: 1px solid rgba(201,168,76,0.25); padding: 2px 9px; border-radius: 5px; }
        .qtype { font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; }
        .qtype.mcq { background: rgba(99,102,241,0.1); color: #a5b4fc; border: 1px solid rgba(99,102,241,0.2); }
        .qtype.truefalse { background: rgba(14,165,233,0.1); color: #7dd3fc; border: 1px solid rgba(14,165,233,0.2); }
        .qresult { margin-left: auto; font-size: 12px; font-weight: 600; }
        .res-ok { color: #4ade80; }
        .res-bad { color: #f87171; }

        .qtext { font-size: 15px; line-height: 1.6; color: var(--text); margin-bottom: 14px; font-weight: 500; }

        .qopts { display: flex; flex-direction: column; gap: 8px; }
        .qopt { text-align: left; padding: 11px 14px; border-radius: 10px; background: var(--surface2); border: 1px solid var(--border); color: var(--text2); font-family: var(--font-b); font-size: 14px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 10px; }
        .qopt:hover:not(.qcorrect-opt):not(.qwrong-opt) { border-color: var(--gold); color: var(--text); }
        .qopt.qselected { border-color: var(--gold); color: var(--gold); background: var(--gold-glow); }
        .qopt.qcorrect-opt { border-color: #4ade80; color: #4ade80; background: rgba(74,222,128,0.07); }
        .qopt.qwrong-opt { border-color: #f87171; color: #f87171; background: rgba(239,68,68,0.07); }
        .opt-bullet { width: 22px; height: 22px; border-radius: 6px; background: var(--surface); border: 1px solid var(--border2); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }

        .qexp { display: flex; gap: 8px; margin-top: 12px; padding: 10px 14px; background: rgba(201,168,76,0.06); border: 1px solid rgba(201,168,76,0.15); border-radius: 8px; font-size: 13px; color: var(--text2); line-height: 1.55; }

        .submit-btn { width: 100%; padding: 14px; border-radius: 12px; background: linear-gradient(135deg, var(--gold), var(--gold2)); border: none; color: #080c14; font-family: var(--font-b); font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.15s; box-shadow: 0 4px 20px var(--gold-glow); }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
      `}</style>
    </div>
  );
}