import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiPlusCircle, FiX } from "react-icons/fi";

export default function AddExpenseModal({ open, onClose, onAdd, people }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [selected, setSelected] = useState([]);

  // ---------------- TOGGLE PEOPLE ----------------
  const togglePerson = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  if (!open) return null;

  // ---------------- SUBMIT ----------------
  const handleSubmit = () => {
    if (!title || !amount || !paidBy || selected.length === 0) return;

    const expense = {
      id: Date.now(),
      title,
      amount: Number(amount),
      paidBy: Number(paidBy),
      participants: selected, // IMPORTANT FIX
    };

    onAdd(expense);
    onClose();

    // reset form
    setTitle("");
    setAmount("");
    setPaidBy("");
    setSelected([]);
  };

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
        className="w-full max-w-md rounded-[22px] border border-white/10 bg-[#10141a]/90 p-6 text-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300/80">
              New transaction
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white">Add Expense</h2>
          </div>
          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-300 transition hover:text-white"
            aria-label="Close add expense modal"
          >
            <FiX />
          </button>
        </div>

        {/* TITLE */}
        <input
          type="text"
          placeholder="Expense title"
          className="mb-3 w-full rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-500 focus:border-teal-300/55 focus:bg-white/[0.075] focus:shadow-[0_0_0_4px_rgba(45,212,191,0.10),0_0_30px_rgba(45,212,191,0.12)]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* AMOUNT */}
        <input
          type="number"
          placeholder="Amount"
          className="mb-3 w-full rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-500 focus:border-teal-300/55 focus:bg-white/[0.075] focus:shadow-[0_0_0_4px_rgba(45,212,191,0.10),0_0_30px_rgba(45,212,191,0.12)]"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* PAID BY */}
        <select
          className="mb-3 w-full rounded-2xl border border-white/10 bg-[#171c24] px-4 py-3 text-sm text-white outline-none transition duration-300 focus:border-teal-300/55 focus:shadow-[0_0_0_4px_rgba(45,212,191,0.10),0_0_30px_rgba(45,212,191,0.12)]"
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
        >
          <option value="">Paid by...</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* SPLIT BETWEEN USERS */}
        <div className="mt-4">
          <h3 className="mb-2 text-sm font-semibold text-slate-200">
            Split between (Select people)
          </h3>

          <div className="max-h-40 space-y-2 overflow-auto rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            {people.map((p) => (
              <label
                key={p.id}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-sm text-slate-300 transition hover:bg-white/[0.05]"
              >
                <span className="relative grid h-5 w-5 place-items-center rounded-md border border-teal-300/30 bg-[#0D0F12]">
                  <input
                    type="checkbox"
                    checked={selected.includes(p.id)}
                    onChange={() => togglePerson(p.id)}
                    className="peer absolute inset-0 cursor-pointer opacity-0"
                  />
                  <FiCheck className="scale-0 text-xs text-teal-200 transition peer-checked:scale-100" />
                </span>
                {p.name}
              </label>
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleSubmit}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-teal-300/30 bg-gradient-to-r from-teal-400 to-violet-500 p-3 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(45,212,191,0.18)]"
        >
          <FiPlusCircle />
          Add Expense
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onClose}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.055] p-3 text-sm font-semibold text-slate-300 transition hover:text-white"
        >
          Cancel
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
