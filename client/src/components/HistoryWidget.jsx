import { motion } from "framer-motion";

export default function HistoryWidget({ summaries, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="glass h-full p-5 flex flex-col"
    >
      <h2 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
        History
      </h2>

      {summaries.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
          No saved summaries yet.
        </div>
      ) : (
        <ul className="flex-1 space-y-2 overflow-y-auto pr-1">
          {summaries.map((s) => (
            <motion.li
              key={s._id}
              whileHover={{ scale: 1.01 }}
              onClick={() => onSelect(s)}
              className="cursor-pointer rounded-xl bg-white/5 border border-white/10 px-4 py-3 transition-colors hover:bg-white/8"
            >
              <p className="text-xs text-slate-400 mb-1">{s.date}</p>
              <p className="text-sm text-slate-300 truncate">
                {s.editedSummary || s.aiSummary}
              </p>
              <p className="text-xs text-slate-500 mt-1 truncate">
                {s.sourceUrl}
              </p>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
