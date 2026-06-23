import { BookOpen, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function Header({ pdfReady, filename }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary glow-primary">
            <BookOpen className="h-4 w-4 text-white" strokeWidth={2.2} />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-text">
              VidyaAI
            </span>
            <p className="hidden text-[10px] font-medium uppercase tracking-widest text-muted sm:block">
              AI Tutor for Every Student
            </p>
          </div>
        </motion.div>

        {!pdfReady && (
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            {["Features", "How It Works", "Architecture", "Why VidyaAI"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm font-medium text-muted transition-colors hover:text-text"
              >
                {item}
              </a>
            ))}
          </nav>
        )}

        {pdfReady && filename && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex max-w-[220px] items-center gap-2 rounded-full border border-success/25 bg-success/10 px-3 py-1.5 text-xs font-medium text-success sm:max-w-xs"
          >
            <FileText className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{filename}</span>
            <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-success" />
          </motion.div>
        )}
      </div>
    </header>
  );
}
