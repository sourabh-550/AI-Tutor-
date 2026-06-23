import { motion } from "framer-motion";
import {
  User,
  FileText,
  Cpu,
  Database,
  Scissors,
  Sparkles,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import GlassCard from "../ui/GlassCard";

const nodes = [
  { icon: User, label: "Student", color: "text-text", bg: "bg-white/10" },
  { icon: FileText, label: "PDF", color: "text-primary", bg: "bg-primary/15" },
  { icon: Cpu, label: "Cohere Embeddings", color: "text-accent", bg: "bg-accent/15" },
  { icon: Database, label: "FAISS", color: "text-secondary", bg: "bg-secondary/15" },
  { icon: Scissors, label: "Context Pruning", color: "text-secondary", bg: "bg-secondary/15" },
  { icon: Sparkles, label: "Groq LLM", color: "text-primary-light", bg: "bg-primary/15" },
  { icon: MessageSquare, label: "Answer", color: "text-success", bg: "bg-success/15" },
];

export default function ArchitectureShowcase() {
  return (
    <section
      id="architecture"
      className="px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="arch-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2
            id="arch-heading"
            className="font-display text-3xl font-bold tracking-tight text-text sm:text-4xl"
          >
            Architecture
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            A production-grade RAG pipeline — from document ingestion to
            grounded answer generation.
          </p>
        </div>

        <GlassCard className="p-6 sm:p-10">
          <div className="flex flex-col items-center gap-2 lg:flex-row lg:flex-wrap lg:justify-center lg:gap-0">
            {nodes.map((node, i) => (
              <motion.div
                key={node.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center"
              >
                <div className="flex flex-col items-center px-3 py-2">
                  <div
                    className={`mb-2 flex h-12 w-12 items-center justify-center rounded-xl ${node.bg} ${node.color}`}
                  >
                    <node.icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <span className="text-center text-xs font-semibold text-text sm:text-sm">
                    {node.label}
                  </span>
                </div>
                {i < nodes.length - 1 && (
                  <>
                    <ArrowRight
                      className="hidden h-4 w-4 shrink-0 text-muted lg:block"
                      strokeWidth={2}
                    />
                    <span className="text-muted lg:hidden">↓</span>
                  </>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 border-t border-border pt-8 sm:grid-cols-3">
            {[
              { label: "Frontend", value: "React + Vite SPA" },
              { label: "Backend", value: "FastAPI on Render" },
              { label: "Vector Store", value: "FAISS IndexFlatIP" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl glass-subtle px-4 py-3 text-center"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-medium text-text">{item.value}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
