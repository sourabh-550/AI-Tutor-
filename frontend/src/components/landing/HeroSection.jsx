import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Button from "../ui/Button";
import UploadPanel from "../UploadPanel";

export default function HeroSection({ onSuccess, onSeeHowItWorks }) {
  return (
    <section className="relative px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-light">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Education
          </div>

          <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-text sm:text-5xl lg:text-[3.25rem]">
            Transform Any Textbook Into{" "}
            <span className="gradient-text">Your Personal AI Tutor</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            Upload your PDF, ask questions in plain language, and get precise
            answers grounded in your textbook. Semantic search, context pruning,
            and fast AI responses — built for students everywhere.
          </p>

          <ul className="mt-8 flex flex-wrap gap-3">
            {["Upload PDF", "Ask Questions", "Grounded Answers", "Generate Quizzes"].map(
              (item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-2 rounded-lg glass-subtle px-3 py-2 text-sm text-muted"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {item}
                </motion.li>
              )
            )}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() =>
                document.getElementById("upload-zone")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Upload PDF
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="lg" onClick={onSeeHowItWorks}>
              See How It Works
            </Button>
          </div>
        </motion.div>

        <motion.div
          id="upload-zone"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <UploadPanel onSuccess={onSuccess} />
        </motion.div>
      </div>
    </section>
  );
}
