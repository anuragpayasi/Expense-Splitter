import React, { useState } from "react";

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
      participants: selected, // ⭐ IMPORTANT FIX
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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4">
      <div className="bg-white p-5 rounded-lg w-full max-w-sm shadow-lg">

        <h2 className="text-xl font-semibold mb-4">Add Expense</h2>

        {/* TITLE */}
        <input
          type="text"
          placeholder="Expense title"
          className="w-full border p-2 rounded mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* AMOUNT */}
        <input
          type="number"
          placeholder="Amount"
          className="w-full border p-2 rounded mb-3"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* PAID BY */}
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

        {/* SPLIT BETWEEN USERS */}
        <div className="mt-3">
          <h3 className="font-semibold mb-2">
            Split between (Select people)
          </h3>

          <div className="space-y-2 max-h-40 overflow-auto border p-2 rounded">
            {people.map((p) => (
              <label key={p.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(p.id)}
                  onChange={() => togglePerson(p.id)}
                />
                {p.name}
              </label>
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-2 rounded mt-4"
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