import * as React from "react";
import { motion } from "framer-motion";

export function Button({ children, className = "", ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border border-teal-300/30 bg-gradient-to-r from-teal-400 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(45,212,191,0.18)] outline-none transition-all duration-300 hover:shadow-[0_18px_45px_rgba(139,92,246,0.28)] focus-visible:ring-2 focus-visible:ring-teal-300/70 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
