import React from "react";
import { motion } from "framer-motion";
import { FiUserPlus, FiX } from "react-icons/fi";

export default function AddPersonModal({ open, onClose, onAdd }) {
  const [name, setName] = React.useState("");

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050608]/75 p-4 backdrop-blur-xl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="w-full max-w-sm rounded-[22px] border border-white/10 bg-[#10141a]/90 p-6 text-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300/80">
              New contact
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white">Add Person</h2>
          </div>
          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-300 transition hover:text-white"
            aria-label="Close add person modal"
          >
            <FiX />
          </button>
        </div>

        <input
          type="text"
          placeholder="Enter name"
          className="mb-5 w-full rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-500 focus:border-teal-300/55 focus:bg-white/[0.075] focus:shadow-[0_0_0_4px_rgba(45,212,191,0.10),0_0_30px_rgba(45,212,191,0.12)]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            Cancel
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              onAdd(name);
              setName("");
              onClose();
            }}
            className="inline-flex items-center gap-2 rounded-2xl border border-teal-300/30 bg-gradient-to-r from-teal-400 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(45,212,191,0.18)]"
          >
            <FiUserPlus />
            Add
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
