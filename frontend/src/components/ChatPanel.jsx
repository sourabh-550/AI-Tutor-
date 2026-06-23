import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { API_BASE } from "../lib/constants";

const SUGGESTIONS = [
  "Summarize the key topics in this document",
  "What are the main concepts covered?",
  "Explain the first chapter in simple words",
  "What is the most important idea in this book?",
];

export default function ChatPanel({ onAnswer }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();
  const inputRef = useRef();
  const msgsRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [question]);

  const ask = async (qOverride) => {
    const q = (qOverride ?? question).trim();
    if (!q || loading) return;
    setMessages((p) => [...p, { role: "user", text: q }]);
    setQuestion("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/ask`, {
        question: q,
        top_k: 5,
        similarity_threshold: 0.25,
      });
      setMessages((p) => [
        ...p,
        {
          role: "ai",
          text: res.data.answer,
          meta: {
            total: res.data.total_candidates,
            pruned: res.data.pruned_count,
          },
        },
      ]);
      onAnswer(res.data.sources, {
        total: res.data.total_candidates,
        pruned: res.data.pruned_count,
      });
    } catch {
      setMessages((p) => [
        ...p,
        {
          role: "ai",
          text: "Something went wrong. Please try again.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] min-h-[520px] flex-col glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold text-text">
            AI Tutor Chat
          </h3>
          <p className="text-xs text-muted">Context-pruned RAG · Groq LLaMA</p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={msgsRef}
        className="flex-1 overflow-y-auto scrollbar-thin px-4 py-5 sm:px-6"
      >
        {messages.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
              <BookOpen className="h-7 w-7" />
            </div>
            <h4 className="font-display text-lg font-semibold text-text">
              Ask anything about your document
            </h4>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Get grounded answers from your textbook. Try a suggestion below.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s, i) => (
                <motion.button
                  key={s}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  onClick={() => ask(s)}
                  className="rounded-full border border-border-strong bg-surface-elevated px-4 py-2 text-xs font-medium text-muted transition-all hover:border-primary/40 hover:text-text hover:bg-primary/10"
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <div className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    m.role === "user"
                      ? "gradient-primary text-white"
                      : "glass-subtle text-primary"
                  }`}
                >
                  {m.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={`max-w-[85%] sm:max-w-[78%] ${m.role === "user" ? "text-right" : ""}`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "gradient-primary text-white rounded-br-md"
                        : m.error
                          ? "border border-red-500/30 bg-red-500/10 text-red-300 rounded-bl-md"
                          : "glass-subtle text-text rounded-bl-md"
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.meta && (
                    <p className="mt-1.5 text-[11px] text-muted">
                      {m.meta.pruned} passages used · {m.meta.total} searched
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg glass-subtle text-primary">
                <Bot className="h-4 w-4" />
              </div>
              <div className="glass-subtle rounded-2xl rounded-bl-md px-5 py-4">
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-2 w-2 rounded-full bg-primary/60"
                      animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                  <span className="ml-2 text-xs text-muted">Thinking…</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex items-end gap-2 rounded-xl border border-border-strong bg-surface-elevated p-2 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
          <textarea
            ref={inputRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                ask();
              }
            }}
            placeholder="Ask a question about your document…"
            disabled={loading}
            rows={1}
            aria-label="Question input"
            className="flex-1 resize-none bg-transparent px-2 py-2 text-sm text-text placeholder:text-muted outline-none disabled:opacity-50"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => ask()}
            disabled={loading || !question.trim()}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-primary text-white disabled:opacity-30"
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
        <p className="mt-2 text-center text-[10px] text-muted">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
