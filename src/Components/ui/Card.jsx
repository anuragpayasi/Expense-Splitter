import * as React from "react";
import { motion } from "framer-motion";

function Card({ children, className = "" }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      className={`rounded-[22px] border border-white/10 bg-white/[0.065] shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default Card;
