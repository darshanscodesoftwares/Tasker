import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Hero from "./components/Hero";
import Workspace from "./components/Workspace";
import { summarizeUrl, saveSummary, getSummaries } from "./api/client";

export default function App() {
  const [summary, setSummary] = useState(null);
  const [summaries, setSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch saved summaries on mount
  useEffect(() => {
    getSummaries()
      .then(setSummaries)
      .catch(() => {
        /* DB may not be connected — silently ignore */
      });
  }, []);

  // Generate summary from a conversation URL
  const handleGenerate = useCallback(async (url) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await summarizeUrl(url);
      setSummary(result);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save summary to MongoDB
  const handleSave = useCallback(async (payload) => {
    setIsSaving(true);
    setError(null);
    try {
      const saved = await saveSummary(payload);
      setSummaries((prev) => [saved, ...prev]);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Load a history item into the summary view
  const handleSelectHistory = useCallback((item) => {
    setSummary({
      sourceUrl: item.sourceUrl,
      rawText: item.rawText,
      aiSummary: item.editedSummary || item.aiSummary,
    });
  }, []);

  return (
    <div className="min-h-screen px-4 pb-12">
      <Hero />

      {/* Error toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto mb-4 max-w-xl rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300"
          >
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-3 text-xs text-red-400 underline"
            >
              dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Workspace
        onGenerate={handleGenerate}
        isLoading={isLoading}
        summary={summary}
        onSave={handleSave}
        isSaving={isSaving}
        summaries={summaries}
        onSelectHistory={handleSelectHistory}
      />
    </div>
  );
}
