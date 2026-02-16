import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="relative text-center pt-12 pb-8">
      {/* Radial glow */}
      <div className="hero-glow" />

      {/* Logo placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          background: "linear-gradient(135deg, #6E8BFF, #8B5CF6)",
        }}
      >
        <span className="text-2xl font-bold text-white">T</span>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="relative z-10 text-4xl font-bold tracking-tight"
        style={{
          background: "linear-gradient(135deg, #6E8BFF, #8B5CF6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        TASKER
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 mt-2 text-sm text-slate-400"
      >
        Turn conversations into clear work logs.
      </motion.p>
    </div>
  );
}
