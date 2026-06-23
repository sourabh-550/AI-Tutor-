import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, HelpCircle } from "lucide-react";
import Header from "./components/Header";
import LandingPage from "./components/landing/LandingPage";
import ChatPanel from "./components/ChatPanel";
import SourceChunks from "./components/SourceChunks";
import QuizPage from "./components/QuizPage";

export default function App() {
  const [pdfReady, setPdfReady] = useState(false);
  const [sources, setSources] = useState([]);
  const [stats, setStats] = useState(null);
  const [filename, setFilename] = useState("");
  const [activeTab, setActiveTab] = useState("chat");

  const handleUploadSuccess = (name) => {
    setFilename(name);
    setPdfReady(true);
  };

  return (
    <div className="relative min-h-screen bg-bg">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute -right-40 top-0 h-[600px] w-[600px] rounded-full bg-primary/8 blur-[140px]" />
        <div className="absolute -left-40 bottom-0 h-[500px] w-[500px] rounded-full bg-secondary/8 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <Header pdfReady={pdfReady} filename={filename} />

        <main>
          {!pdfReady ? (
            <LandingPage onSuccess={handleUploadSuccess} />
          ) : (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* Workspace tabs */}
              <div className="flex gap-1 border-b border-border pt-4">
                <TabButton
                  active={activeTab === "chat"}
                  onClick={() => setActiveTab("chat")}
                  icon={MessageSquare}
                  label="Chat"
                />
                <TabButton
                  active={activeTab === "quiz"}
                  onClick={() => setActiveTab("quiz")}
                  icon={HelpCircle}
                  label="Quiz"
                />
              </div>

              {activeTab === "chat" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid gap-5 py-6 lg:grid-cols-[1fr_380px] lg:gap-6"
                >
                  <ChatPanel
                    onAnswer={(src, st) => {
                      setSources(src);
                      setStats(st);
                    }}
                  />
                  <SourceChunks sources={sources} stats={stats} />
                </motion.div>
              )}

              {activeTab === "quiz" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-6"
                >
                  <QuizPage />
                </motion.div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      aria-selected={active}
      role="tab"
      className={`
        relative flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
        ${active ? "text-primary" : "text-muted hover:text-text"}
      `}
    >
      <Icon className="h-4 w-4" strokeWidth={2} />
      {label}
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 gradient-primary"
        />
      )}
    </button>
  );
}
