import React, { useState } from "react";

export default function AddExpenseModal({ open, onClose, onAdd, people }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!title || !amount || !paidBy) return;

    const expense = {
      id: Date.now(),
      title,
      amount: Number(amount),
      paidBy: Number(paidBy), // IMPORTANT ✔✔
    };

    onAdd(expense);
    onClose();

    setTitle("");
    setAmount("");
    setPaidBy("");
  };

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-40 flex justify-center items-center p-4">
      <div className="bg-white p-5 rounded-lg w-full max-w-sm shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add Expense</h2>

        {/* Title */}
        <input
          type="text"
          placeholder="Expense title"
          className="w-full border p-2 rounded mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Amount */}
        <input
          type="number"
          placeholder="Amount"
          className="w-full border p-2 rounded mb-3"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* Paid By */}
        <select
          className="w-full border p-2 rounded mb-3"
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

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-2 rounded mt-2"
        >
          Add Expense
        </button>

        <button
          onClick={onClose}
          className="w-full bg-gray-200 text-black p-2 rounded mt-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}