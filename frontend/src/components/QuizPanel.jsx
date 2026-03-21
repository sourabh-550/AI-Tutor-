import { useState } from "react";
import axios from "axios";

export default function QuizPanel({ onClose }) {
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
    } catch (err) {
      alert("Failed to generate quiz. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const select = (qi, option) => {
    if (submitted) return;
    setAnswers(p => ({ ...p, [qi]: option }));
  };

  const submit = () => {
    let s = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) s++;
    });
    setScore(s);
    setSubmitted(true);
  };

  const reset = () => {
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setTopic("");
  };

  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

  return (
    <div className="quiz-overlay">
      <div className="quiz-modal">
        {/* Header */}
        <div className="quiz-header">
          <div className="quiz-title-row">
            <div className="quiz-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h2 className="quiz-title">Quiz Generator</h2>
              <p className="quiz-sub">Auto-generated from your document</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="quiz-body">
          {/* Score Banner */}
          {submitted && (
            <div className={`score-banner ${score >= questions.length * 0.7 ? "score-good" : "score-bad"}`}>
              <div className="score-num">{score}/{questions.length}</div>
              <div className="score-label">
                {score === questions.length ? "Perfect Score! 🎉" :
                 score >= questions.length * 0.7 ? "Great Job! 👍" :
                 score >= questions.length * 0.4 ? "Keep Practicing 📚" : "Review the material 💪"}
              </div>
              <button className="retry-btn" onClick={reset}>Try Again</button>
            </div>
          )}

          {/* Controls */}
          {questions.length === 0 && !loading && (
            <div className="quiz-controls">
              <div className="control-group">
                <label className="ctrl-label">Topic (optional)</label>
                <input
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. Photosynthesis, World War II..."
                  className="ctrl-input"
                />
              </div>
              <div className="control-group">
                <label className="ctrl-label">Number of Questions</label>
                <div className="num-row">
                  {[5, 10, 15].map(n => (
                    <button key={n} className={`num-btn ${numQ === n ? "active" : ""}`} onClick={() => setNumQ(n)}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <button className="gen-btn" onClick={generate}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <polygon points="5 3 19 12 5 21 5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Generate Quiz
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="quiz-loading">
              <div className="quiz-ring" />
              <p>Generating quiz from your document<span className="qdots"><span>.</span><span>.</span><span>.</span></span></p>
            </div>
          )}

          {/* Questions */}
          {questions.length > 0 && (
            <div className="questions-list">
              {questions.map((q, qi) => (
                <div key={qi} className={`question-card ${submitted ? (answers[qi] === q.correct ? "q-correct" : "q-wrong") : ""}`}>
                  <div className="q-top">
                    <span className="q-num">Q{qi + 1}</span>
                    <span className={`q-type ${q.type}`}>{q.type === "mcq" ? "MCQ" : "True/False"}</span>
                  </div>
                  <p className="q-text">{q.question}</p>
                  <div className="options">
                    {q.options.map((opt, oi) => {
                      let cls = "option";
                      if (answers[qi] === opt) cls += " selected";
                      if (submitted && opt === q.correct) cls += " correct";
                      if (submitted && answers[qi] === opt && opt !== q.correct) cls += " wrong";
                      return (
                        <button key={oi} className={cls} onClick={() => select(qi, opt)}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {submitted && (
                    <div className="explanation">
                      <span className="exp-icon">💡</span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}

              {!submitted && (
                <button className="submit-btn" disabled={!allAnswered} onClick={submit}>
                  Submit Quiz ({Object.keys(answers).length}/{questions.length} answered)
                </button>
              )}

              {submitted && (
                <button className="gen-btn" onClick={reset} style={{ marginTop: 8 }}>
                  Generate New Quiz
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .quiz-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px; animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        .quiz-modal {
          background: #0d1220; border: 1px solid var(--border2);
          border-radius: 24px; width: 100%; max-width: 680px;
          max-height: 88vh; display: flex; flex-direction: column;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6);
          animation: slideUp 0.25s ease;
        }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        .quiz-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 22px 24px; border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .quiz-title-row { display: flex; align-items: center; gap: 12px; }
        .quiz-icon {
          width: 40px; height: 40px; border-radius: 12px;
          background: var(--gold-glow); border: 1px solid rgba(201,168,76,0.3);
          color: var(--gold); display: flex; align-items: center; justify-content: center;
        }
        .quiz-title { font-family: var(--font-d); font-weight: 700; font-size: 17px; margin-bottom: 2px; }
        .quiz-sub { font-size: 12px; color: var(--text3); }
        .close-btn {
          width: 34px; height: 34px; border-radius: 8px;
          background: var(--surface2); border: 1px solid var(--border);
          color: var(--text2); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .close-btn:hover { background: rgba(239,68,68,0.1); color: #f87171; border-color: rgba(239,68,68,0.3); }

        .quiz-body { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 20px; scrollbar-width: thin; }

        .score-banner {
          border-radius: 14px; padding: 20px 24px;
          display: flex; align-items: center; gap: 16px; flex-shrink: 0;
        }
        .score-good { background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.25); }
        .score-bad { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); }
        .score-num { font-family: var(--font-d); font-size: 32px; font-weight: 700; color: var(--gold); }
        .score-label { font-size: 14px; color: var(--text2); flex: 1; }
        .retry-btn {
          background: var(--surface2); border: 1px solid var(--border2);
          color: var(--text2); border-radius: 8px; padding: 8px 16px;
          font-size: 13px; cursor: pointer; font-family: var(--font-b);
          transition: all 0.15s;
        }
        .retry-btn:hover { border-color: var(--gold); color: var(--gold); }

        .quiz-controls { display: flex; flex-direction: column; gap: 18px; }
        .control-group { display: flex; flex-direction: column; gap: 8px; }
        .ctrl-label { font-size: 12px; font-weight: 600; color: var(--text2); letter-spacing: 0.3px; text-transform: uppercase; }
        .ctrl-input {
          background: var(--surface2); border: 1px solid var(--border2);
          border-radius: 10px; padding: 11px 14px; color: var(--text);
          font-family: var(--font-b); font-size: 14px; outline: none;
          transition: border-color 0.2s;
        }
        .ctrl-input::placeholder { color: var(--text3); }
        .ctrl-input:focus { border-color: var(--gold); }
        .num-row { display: flex; gap: 8px; }
        .num-btn {
          flex: 1; padding: 10px; border-radius: 10px;
          background: var(--surface2); border: 1px solid var(--border2);
          color: var(--text2); font-family: var(--font-b); font-size: 14px;
          cursor: pointer; transition: all 0.15s;
        }
        .num-btn.active { background: var(--gold-glow); border-color: var(--gold); color: var(--gold); font-weight: 600; }
        .num-btn:hover:not(.active) { border-color: var(--border2); color: var(--text); }

        .gen-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: linear-gradient(135deg, var(--gold), var(--gold2));
          border: none; border-radius: 12px; padding: 13px 20px;
          color: #080c14; font-family: var(--font-b); font-size: 14px;
          font-weight: 600; cursor: pointer; transition: all 0.15s;
          box-shadow: 0 4px 20px var(--gold-glow);
        }
        .gen-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(201,168,76,0.3); }

        .quiz-loading { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 40px 0; }
        .quiz-ring { width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--border2); border-top-color: var(--gold); animation: spin 0.9s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .quiz-loading p { font-size: 14px; color: var(--text2); }
        .qdots span { animation: blink 1.4s infinite; }
        .qdots span:nth-child(2) { animation-delay: 0.2s; }
        .qdots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink { 0%,80%,100%{opacity:0} 40%{opacity:1} }

        .questions-list { display: flex; flex-direction: column; gap: 14px; }
        .question-card {
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 14px; padding: 18px;
          transition: border-color 0.2s;
        }
        .q-correct { border-color: rgba(74,222,128,0.4); background: rgba(74,222,128,0.04); }
        .q-wrong { border-color: rgba(239,68,68,0.4); background: rgba(239,68,68,0.04); }

        .q-top { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .q-num { font-family: var(--font-d); font-weight: 700; font-size: 12px; color: var(--gold); background: var(--gold-glow); border: 1px solid rgba(201,168,76,0.25); padding: 2px 8px; border-radius: 5px; }
        .q-type { font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; padding: 2px 7px; border-radius: 4px; }
        .q-type.mcq { background: rgba(99,102,241,0.1); color: #a5b4fc; border: 1px solid rgba(99,102,241,0.2); }
        .q-type.truefalse { background: rgba(14,165,233,0.1); color: #7dd3fc; border: 1px solid rgba(14,165,233,0.2); }

        .q-text { font-size: 14px; line-height: 1.6; color: var(--text); margin-bottom: 12px; font-weight: 500; }

        .options { display: flex; flex-direction: column; gap: 7px; }
        .option {
          text-align: left; padding: 10px 14px; border-radius: 9px;
          background: var(--surface); border: 1px solid var(--border);
          color: var(--text2); font-family: var(--font-b); font-size: 13.5px;
          cursor: pointer; transition: all 0.15s;
        }
        .option:hover:not(.correct):not(.wrong) { border-color: var(--gold); color: var(--text); }
        .option.selected { border-color: var(--gold); color: var(--gold); background: var(--gold-glow); }
        .option.correct { border-color: #4ade80; color: #4ade80; background: rgba(74,222,128,0.08); }
        .option.wrong { border-color: #f87171; color: #f87171; background: rgba(239,68,68,0.08); }

        .explanation {
          display: flex; align-items: flex-start; gap: 8px;
          margin-top: 12px; padding: 10px 12px;
          background: rgba(201,168,76,0.06); border: 1px solid rgba(201,168,76,0.15);
          border-radius: 8px; font-size: 12.5px; color: var(--text2); line-height: 1.5;
        }
        .exp-icon { flex-shrink: 0; }

        .submit-btn {
          width: 100%; padding: 13px; border-radius: 12px;
          background: linear-gradient(135deg, var(--gold), var(--gold2));
          border: none; color: #080c14; font-family: var(--font-b);
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: all 0.15s; box-shadow: 0 4px 20px var(--gold-glow);
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
      `}</style>
    </div>
  );
}