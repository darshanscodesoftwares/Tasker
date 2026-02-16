import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function SummaryWidget({ summary, onSave, isSaving }) {
  const [edited, setEdited] = useState("");

  // Sync internal state when a new summary arrives
  useEffect(() => {
    if (summary?.aiSummary) {
      setEdited(summary.aiSummary);
    }
  }, [summary?.aiSummary]);

  const handleSave = () => {
    if (!summary) return;
    onSave({
      sourceUrl: summary.sourceUrl,
      rawText: summary.rawText,
      aiSummary: summary.aiSummary,
      editedSummary: edited,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="glass h-full p-5 flex flex-col"
    >
      <h2 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
        Summary
      </h2>

      {summary ? (
        <>
          <textarea
            value={edited}
            onChange={(e) => setEdited(e.target.value)}
            rows={10}
            className="flex-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-slate-200 resize-none leading-relaxed"
          />
          <motion.button
            onClick={handleSave}
            disabled={isSaving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-3 w-full rounded-xl py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #6E8BFF, #8B5CF6)",
            }}
          >
            {isSaving ? "Saving..." : "Save Summary"}
          </motion.button>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
          Generate a summary to see results here.
        </div>
      )}
    </motion.div>
  );
}
