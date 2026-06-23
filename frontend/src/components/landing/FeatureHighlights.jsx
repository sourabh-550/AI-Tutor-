import {
  BookOpen,
  Search,
  Scissors,
  Bot,
  ClipboardList,
  Zap,
} from "lucide-react";
import GlassCard from "../ui/GlassCard";

const features = [
  {
    icon: BookOpen,
    title: "Smart PDF Understanding",
    desc: "Extracts and chunks textbook content into searchable passages with overlap for context continuity.",
    color: "text-primary",
    bg: "bg-primary/15",
  },
  {
    icon: Search,
    title: "Semantic Search",
    desc: "Cohere embeddings find passages by meaning — not just keywords — for accurate retrieval.",
    color: "text-accent",
    bg: "bg-accent/15",
  },
  {
    icon: Scissors,
    title: "Context Pruning",
    desc: "Filters 20 candidates down to the top 5 most relevant passages before LLM generation.",
    color: "text-secondary",
    bg: "bg-secondary/15",
  },
  {
    icon: Bot,
    title: "AI Tutor",
    desc: "Groq-powered LLaMA explains concepts clearly, using only your textbook as the source of truth.",
    color: "text-primary-light",
    bg: "bg-primary/15",
  },
  {
    icon: ClipboardList,
    title: "Quiz Generator",
    desc: "Auto-generate MCQ and True/False quizzes from your document to test understanding.",
    color: "text-success",
    bg: "bg-success/15",
  },
  {
    icon: Zap,
    title: "Fast Responses",
    desc: "Optimized RAG pipeline with pruned context delivers answers in seconds, even on slow networks.",
    color: "text-accent",
    bg: "bg-accent/15",
  },
];

export default function FeatureHighlights() {
  return (
    <section
      id="features"
      className="px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2
            id="features-heading"
            className="font-display text-3xl font-bold tracking-tight text-text sm:text-4xl"
          >
            Built for Intelligent Learning
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Every feature is designed to turn static textbooks into interactive,
            trustworthy study experiences.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <GlassCard key={f.title} hover delay={i * 0.06} className="p-6">
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${f.bg} ${f.color}`}
              >
                <f.icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="font-display text-lg font-semibold text-text">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {f.desc}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
