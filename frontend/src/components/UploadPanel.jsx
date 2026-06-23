import { useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { API_BASE } from "../lib/constants";

export default function UploadPanel({ onSuccess, compact = false }) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.name.endsWith(".pdf")) {
      setStatus("error:Only PDF files are supported.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setProgress(0);
    setStatus("loading:");

    const iv = setInterval(
      () => setProgress((p) => (p < 82 ? p + Math.random() * 5 : p)),
      400
    );

    try {
      const res = await axios.post(`${API_BASE}/upload`, formData, {
        timeout: 120000,
      });
      clearInterval(iv);
      setProgress(100);
      setStatus(
        `ok:${res.data.filename} · ${res.data.chunks_created} passages indexed`
      );
      setTimeout(() => onSuccess(res.data.filename), 900);
    } catch (err) {
      clearInterval(iv);
      setStatus(
        "error:" + (err.response?.data?.detail || "Upload failed. Try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const type = status.split(":")[0];
  const msg = status.split(":").slice(1).join(":");

  return (
    <div className={compact ? "" : "glass rounded-2xl p-6 sm:p-7"}>
      {!compact && (
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Upload className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-text">
              Upload Your Textbook
            </h3>
            <p className="text-sm text-muted">PDF — any size, any subject</p>
          </div>
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        aria-label="Upload PDF file"
        onKeyDown={(e) => e.key === "Enter" && !loading && inputRef.current?.click()}
        className={`
          group relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300
          ${compact ? "p-8" : "p-10"}
          ${drag ? "border-primary bg-primary/10" : "border-border-strong hover:border-primary/50 hover:bg-primary/5"}
          ${loading ? "pointer-events-none opacity-90" : ""}
        `}
        onClick={() => !loading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          aria-hidden="true"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium text-muted">
                Processing your document…
              </p>
              <div className="h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full gradient-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="font-mono text-xs text-muted">
                {Math.round(progress)}%
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-elevated text-primary transition-transform group-hover:-translate-y-1">
                <FileText className="h-6 w-6" />
              </div>
              <p className="mb-1 font-semibold text-text">
                Drop your PDF here
              </p>
              <p className="text-sm text-muted">or click to browse files</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
              type === "ok"
                ? "border border-success/25 bg-success/10 text-success"
                : type === "error"
                  ? "border border-red-500/25 bg-red-500/10 text-red-400"
                  : ""
            }`}
          >
            {type === "ok" && <CheckCircle2 className="h-4 w-4 shrink-0" />}
            {type === "error" && <AlertCircle className="h-4 w-4 shrink-0" />}
            <span>{msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
