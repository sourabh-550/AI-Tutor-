import { motion } from "framer-motion";
import {
  Upload,
  Layers,
  Cpu,
  Database,
  Scissors,
  Sparkles,
  MessageSquare,
} from "lucide-react";

const steps = [
  { icon: Upload, label: "Upload PDF", sub: "Student uploads textbook" },
  { icon: Layers, label: "Chunking", sub: "300-word passages" },
  { icon: Cpu, label: "Embeddings", sub: "Cohere vectors" },
  { icon: Database, label: "FAISS Retrieval", sub: "Top-20 candidates" },
  { icon: Scissors, label: "Context Pruning", sub: "Filter to top-5" },
  { icon: Sparkles, label: "LLM Generation", sub: "Groq LLaMA" },
  { icon: MessageSquare, label: "Answer", sub: "Grounded response" },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <h2
            id="how-heading"
            className="font-display text-3xl font-bold tracking-tight text-text sm:text-4xl"
          >
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            From PDF upload to AI answer — a transparent RAG pipeline optimized
            for speed and accuracy.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent lg:block" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 mb-3 flex h-14 w-14 items-center justify-center rounded-2xl glass border-border-strong text-primary transition-transform hover:scale-105">
                  <step.icon className="h-6 w-6" strokeWidth={1.8} />
                </div>
                <span className="font-display text-sm font-semibold text-text">
                  {step.label}
                </span>
                <span className="mt-1 text-xs text-muted">{step.sub}</span>

                {i < steps.length - 1 && (
                  <div className="my-2 text-muted lg:hidden">↓</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
