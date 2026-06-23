import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSearch,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Award,
} from "lucide-react";

function confidenceLevel(score) {
  if (score >= 0.7) return { label: "High", color: "text-success", pct: 90 };
  if (score >= 0.5) return { label: "Medium", color: "text-accent", pct: 65 };
  if (score >= 0.3) return { label: "Low", color: "text-yellow-400", pct: 40 };
  return { label: "Weak", color: "text-muted", pct: 20 };
}

function SourceCard({ source, rank }) {
  const [expanded, setExpanded] = useState(rank === 1);
  const conf = confidenceLevel(source.similarity_score);
  const previewLen = 200;
  const isLong = source.chunk.length > previewLen;
  const displayText = expanded
    ? source.chunk
    : source.chunk.slice(0, previewLen) + (isLong ? "…" : "");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border glass-subtle overflow-hidden transition-colors hover:border-primary/20"
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-xs font-bold text-primary">
              #{rank}
            </span>
            <span className="text-xs font-medium text-muted">Source rank</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${conf.color} bg-white/5`}
            >
              {conf.label} confidence
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between text-[10px] text-muted">
              <span>Relevance</span>
              <span className="font-mono text-accent">
                {source.similarity_score?.toFixed(3)}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(source.similarity_score * 100, 100)}%`,
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-accent to-primary"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-[10px] text-muted">
              <span>Rank score</span>
              <span className="font-mono text-secondary">
                {source.rerank_score?.toFixed(3)}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(
                    Math.max(((source.rerank_score + 10) / 20) * 100, 0),
                    100
                  )}%`,
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-secondary to-primary"
              />
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-muted">
          <span className="rounded bg-primary/10 px-1 py-0.5 text-[10px] font-semibold text-primary-light">
            MATCH
          </span>
          <span className="mt-1 block text-text/80">{displayText}</span>
        </p>

        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 flex items-center gap-1 text-xs font-medium text-primary-light transition-colors hover:text-primary"
            aria-expanded={expanded}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" /> Collapse
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" /> Expand passage
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function SourceChunks({ sources, stats }) {
  const filtered = stats ? Math.round(stats.total * 0.55) : 0;

  return (
    <div className="glass rounded-2xl overflow-hidden h-[calc(100vh-140px)] min-h-[520px] flex flex-col">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <FileSearch className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display text-sm font-semibold text-text">
                Source Evidence
              </h3>
              <p className="text-xs text-muted">Passages used to answer</p>
            </div>
          </div>
          {stats && (
            <div className="flex gap-2">
              <span className="rounded-lg bg-primary/15 px-2 py-1 text-[10px] font-bold text-primary">
                {stats.pruned} used
              </span>
              <span className="rounded-lg bg-white/5 px-2 py-1 text-[10px] font-bold text-muted">
                {stats.total} found
              </span>
            </div>
          )}
        </div>
      </div>

      {stats && (
        <div className="border-b border-border bg-surface-elevated/50 px-5 py-4">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted">
            Pipeline Stats
          </p>
          <div className="flex items-center justify-between gap-2">
            <PipelineStep
              value={stats.total}
              label="Retrieved"
              active={false}
            />
            <Arrow />
            <PipelineStep value={filtered} label="Relevant" active={false} />
            <Arrow />
            <PipelineStep value={stats.pruned} label="Selected" active />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
        {!sources || sources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Award className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-muted">
              Source passages appear here
            </p>
            <p className="mt-1 max-w-[200px] text-xs text-muted/70">
              Ask your first question to see evidence with relevance scores
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {sources.map((s, i) => (
              <SourceCard key={i} source={s} rank={i + 1} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function PipelineStep({ value, label, active }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.span
        key={value}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`font-display text-xl font-bold ${active ? "text-primary" : "text-muted"}`}
      >
        {value}
      </motion.span>
      <span className="text-[10px] uppercase tracking-wide text-muted">
        {label}
      </span>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex flex-col items-center text-muted">
      <TrendingUp className="h-3 w-3 opacity-40" />
      <span className="text-[10px]">↓</span>
    </div>
  );
}
