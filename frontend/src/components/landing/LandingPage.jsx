import HeroSection from "./HeroSection";
import FeatureHighlights from "./FeatureHighlights";
import HowItWorks from "./HowItWorks";
import ArchitectureShowcase from "./ArchitectureShowcase";
import WhyVidyaAI from "./WhyVidyaAI";

export default function LandingPage({ onSuccess }) {
  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
      >
        <div className="absolute -right-32 top-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-secondary/10 blur-[100px]" />
        <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-accent/5 blur-[80px]" />
      </div>

      <div className="relative z-10">
        <HeroSection onSuccess={onSuccess} onSeeHowItWorks={scrollToHowItWorks} />
        <FeatureHighlights />
        <HowItWorks />
        <ArchitectureShowcase />
        <WhyVidyaAI />

        <footer className="border-t border-border px-4 py-8 text-center text-sm text-muted">
          <p>VidyaAI — AI Tutor for Every Student</p>
          <p className="mt-1 text-xs">Built with RAG · FAISS · Cohere · Groq</p>
        </footer>
      </div>
    </div>
  );
}
