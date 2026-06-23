import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Play,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Trophy,
  BookMarked,
  Dumbbell,
  Star,
  RotateCcw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Button from "./ui/Button";
import { API_BASE } from "../lib/constants";

const BADGES = [
  { min: 100, label: "Excellent", emoji: "🏆", icon: Trophy, color: "text-success", bg: "bg-success/15 border-success/30" },
  { min: 70, label: "Good Understanding", emoji: "📚", icon: BookMarked, color: "text-primary", bg: "bg-primary/15 border-primary/30" },
  { min: 40, label: "Needs Revision", emoji: "💪", icon: Dumbbell, color: "text-accent", bg: "bg-accent/15 border-accent/30" },
  { min: 0, label: "Keep Learning", emoji: "⭐", icon: Star, color: "text-muted", bg: "bg-white/5 border-border-strong" },
];

function getBadge(pct) {
  return BADGES.find((b) => pct >= b.min) || BADGES[BADGES.length - 1];
}

export default function QuizPage() {
  const [topic, setTopic] = useState("");
  const [numQ, setNumQ] = useState(10);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);

  const generate = async () => {
    setLoading(true);
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setCurrentQ(0);
    try {
      const res = await axios.post(`${API_BASE}/quiz`, {
        topic,
        num_questions: numQ,
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
    setAnswers((p) => ({ ...p, [qi]: opt }));
  };

  const submit = () => {
    let s = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) s++;
    });
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
    setCurrentQ(0);
  };

  const allAnswered =
    questions.length > 0 && Object.keys(answers).length === questions.length;
  const pct =
    questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const badge = getBadge(pct);
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="mx-auto max-w-3xl pb-16">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
          <HelpCircle className="h-6 w-6" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-text">
            Quiz Generator
          </h2>
          <p className="text-sm text-muted">
            Auto-generated from your uploaded document
          </p>
        </div>
      </div>

      {/* Score screen */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-8 rounded-2xl border p-6 sm:p-8 ${badge.bg}`}
          >
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="relative"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-current bg-surface/50">
                  <span className="font-display text-2xl font-bold gradient-text">
                    {pct}%
                  </span>
                </div>
                <span className="absolute -right-1 -top-1 text-2xl">
                  {badge.emoji}
                </span>
              </motion.div>

              <div className="flex-1 text-center sm:text-left">
                <h3 className={`font-display text-xl font-bold ${badge.color}`}>
                  {badge.label}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {score} correct out of {questions.length} questions
                </p>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full gradient-primary"
                  />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <StatBox label="Correct" value={score} color="text-success" />
                  <StatBox
                    label="Wrong"
                    value={questions.length - score}
                    color="text-red-400"
                  />
                  <StatBox label="Score" value={`${pct}%`} color="text-primary" />
                </div>
              </div>

              <Button variant="secondary" size="sm" onClick={reset}>
                <RotateCcw className="h-4 w-4" />
                New Quiz
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Setup */}
      {questions.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 sm:p-8"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
                Topic (optional)
              </label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generate()}
                placeholder="e.g. Photosynthesis, Gravity, Chapter 3…"
                className="w-full rounded-xl border border-border-strong bg-surface-elevated px-4 py-3 text-sm text-text placeholder:text-muted outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
                Questions
              </label>
              <div className="flex gap-2">
                {[5, 10, 15].map((n) => (
                  <button
                    key={n}
                    onClick={() => setNumQ(n)}
                    className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition-all ${
                      numQ === n
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border-strong bg-surface-elevated text-muted hover:text-text"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <Button className="mt-6 w-full" size="lg" onClick={generate}>
            <Play className="h-4 w-4" />
            Generate Quiz
          </Button>
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center gap-4 py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted">
            Generating {numQ} questions from your document…
          </p>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-1.5 w-8 rounded-full bg-primary/30"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Questions */}
      {questions.length > 0 && (
        <div className="space-y-6">
          {/* Progress bar */}
          {!submitted && (
            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Progress</span>
                <span>{answeredCount}/{questions.length} answered</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full gradient-primary"
                  animate={{
                    width: `${(answeredCount / questions.length) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Question nav dots */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQ(i)}
                    aria-label={`Go to question ${i + 1}`}
                    className={`h-8 w-8 rounded-lg text-xs font-semibold transition-all ${
                      currentQ === i
                        ? "gradient-primary text-white"
                        : answers[i]
                          ? "bg-success/20 text-success"
                          : "bg-white/5 text-muted hover:bg-white/10"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 text-sm text-muted">
            <span>{questions.length} questions</span>
            {!submitted && <span>{answeredCount} answered</span>}
            <button
              onClick={reset}
              className="ml-auto text-xs font-medium text-muted transition-colors hover:text-primary"
            >
              ← New Quiz
            </button>
          </div>

          {/* Single question view (when not submitted) or all (when submitted) */}
          {!submitted ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <QuestionCard
                  q={questions[currentQ]}
                  qi={currentQ}
                  answers={answers}
                  submitted={submitted}
                  onSelect={select}
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            questions.map((q, qi) => (
              <QuestionCard
                key={qi}
                q={q}
                qi={qi}
                answers={answers}
                submitted={submitted}
                onSelect={select}
              />
            ))
          )}

          {/* Navigation */}
          {!submitted && questions.length > 0 && (
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentQ === 0}
                onClick={() => setCurrentQ((c) => c - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              {currentQ < questions.length - 1 ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentQ((c) => c + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  disabled={!allAnswered}
                  onClick={submit}
                >
                  Submit Quiz
                </Button>
              )}
            </div>
          )}

          {!submitted && currentQ < questions.length - 1 && allAnswered && (
            <Button className="w-full" size="lg" onClick={submit}>
              Submit Quiz · {answeredCount}/{questions.length}
            </Button>
          )}

          {submitted && (
            <Button className="w-full" size="lg" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
              Generate New Quiz
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div className="rounded-xl glass-subtle px-3 py-2 text-center">
      <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
      <p className={`font-display text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}

function QuestionCard({ q, qi, answers, submitted, onSelect }) {
  const isCorrect = answers[qi] === q.correct;

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 transition-colors ${
        submitted
          ? isCorrect
            ? "border-success/30 bg-success/5"
            : "border-red-500/30 bg-red-500/5"
          : "border-border-strong glass"
      }`}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">
          Q{qi + 1}
        </span>
        <span
          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${
            q.type === "mcq"
              ? "bg-secondary/15 text-secondary"
              : "bg-accent/15 text-accent"
          }`}
        >
          {q.type === "mcq" ? "MCQ" : "True / False"}
        </span>
        {submitted && (
          <span
            className={`ml-auto flex items-center gap-1 text-xs font-semibold ${
              isCorrect ? "text-success" : "text-red-400"
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <XCircle className="h-3.5 w-3.5" />
            )}
            {isCorrect ? "Correct" : "Wrong"}
          </span>
        )}
      </div>

      <p className="mb-5 text-base font-medium leading-relaxed text-text">
        {q.question}
      </p>

      <div className="space-y-2">
        {q.options.map((opt, oi) => {
          const selected = answers[qi] === opt;
          const isAnswer = opt === q.correct;
          let cls =
            "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ";

          if (submitted && isAnswer) {
            cls += "border-success/40 bg-success/10 text-success";
          } else if (submitted && selected && !isAnswer) {
            cls += "border-red-500/40 bg-red-500/10 text-red-400";
          } else if (selected) {
            cls += "border-primary bg-primary/15 text-primary-light";
          } else {
            cls +=
              "border-border bg-surface-elevated/50 text-muted hover:border-primary/30 hover:text-text";
          }

          return (
            <motion.button
              key={oi}
              whileTap={!submitted ? { scale: 0.98 } : {}}
              className={cls}
              onClick={() => onSelect(qi, opt)}
              disabled={submitted}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  selected ? "bg-primary text-white" : "bg-white/5 text-muted"
                }`}
              >
                {String.fromCharCode(65 + oi)}
              </span>
              {opt}
            </motion.button>
          );
        })}
      </div>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 flex gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted"
        >
          <span>💡</span>
          <span>{q.explanation}</span>
        </motion.div>
      )}
    </div>
  );
}
