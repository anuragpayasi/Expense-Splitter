import React from "react";
import { motion } from "framer-motion";
import { FiMenu } from "react-icons/fi";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0D0F12]/75 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4"
      >
        <h1 className="text-xl font-semibold tracking-wide text-white">
          Expense{" "}
          <span className="bg-gradient-to-r from-teal-300 to-violet-400 bg-clip-text text-transparent">
            Splitter
          </span>
        </h1>

        <ul className="hidden gap-8 text-sm font-medium text-slate-300 md:flex">
          <li className="cursor-pointer transition hover:text-teal-300">Home</li>
          <li className="cursor-pointer transition hover:text-teal-300">People</li>
          <li className="cursor-pointer transition hover:text-teal-300">Summary</li>
        </ul>

        <div className="grid h-10 w-10 cursor-pointer place-items-center rounded-2xl border border-white/10 bg-white/5 text-2xl text-slate-100 md:hidden">
          <FiMenu />
        </div>
      </motion.div>
    </nav>
  );
}
