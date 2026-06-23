import {
  GraduationCap,
  MapPin,
  Coins,
  Zap,
  ShieldCheck,
  Eye,
} from "lucide-react";
import GlassCard from "../ui/GlassCard";

const reasons = [
  {
    icon: GraduationCap,
    title: "Designed for Students",
    desc: "Clear explanations at Class 6–12 level. Built for self-learners using textbooks and study guides.",
  },
  {
    icon: MapPin,
    title: "Rural Education Focus",
    desc: "Works on slow internet. No video streaming. Lightweight architecture for resource-constrained areas.",
  },
  {
    icon: Coins,
    title: "Low-Cost Architecture",
    desc: "Free-tier Cohere + Groq APIs. Context pruning reduces token costs on every query.",
  },
  {
    icon: Zap,
    title: "Fast Inference",
    desc: "Groq LPU hardware delivers sub-3-second responses with pruned context for efficiency.",
  },
  {
    icon: ShieldCheck,
    title: "Source-Grounded Answers",
    desc: "RAG constrains the LLM to your textbook. Reduces hallucination with verifiable passages.",
  },
  {
    icon: Eye,
    title: "Transparency via Evidence",
    desc: "Every answer shows the exact passages used, with relevance scores and pipeline stats.",
  },
];

export default function WhyVidyaAI() {
  return (
    <section
      id="why-vidyaai"
      className="px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="why-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2
            id="why-heading"
            className="font-display text-3xl font-bold tracking-tight text-text sm:text-4xl"
          >
            Why VidyaAI
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Purpose-built for affordable, trustworthy AI tutoring — not generic
            chatbot experiences.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <GlassCard key={r.title} delay={i * 0.05} className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <r.icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="font-display font-semibold text-text">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{r.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
