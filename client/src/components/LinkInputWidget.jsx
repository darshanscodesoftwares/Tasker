import { useState } from "react";
import { motion } from "framer-motion";

export default function LinkInputWidget({ onGenerate, isLoading }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    onGenerate(url.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="glass h-full p-5 flex flex-col"
    >
      <h2 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
        Paste Link
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://share.example.com/conversation/..."
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-slate-200 placeholder-slate-500 transition-colors"
        />

        <motion.button
          type="submit"
          disabled={isLoading || !url.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-auto w-full rounded-xl py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
          style={{
            background: "linear-gradient(135deg, #6E8BFF, #8B5CF6)",
          }}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="opacity-25"
                />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
                  className="opacity-75"
                />
              </svg>
              Generating...
            </span>
          ) : (
            "Generate Summary"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
