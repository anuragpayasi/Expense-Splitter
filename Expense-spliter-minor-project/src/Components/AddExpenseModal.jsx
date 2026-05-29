import React, { useState } from "react";

export default function AddExpenseModal({ open, onClose, onAdd, people }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [selectedPeople, setSelectedPeople] = useState([]);

  if (!open) return null;

  const togglePerson = (id) => {
    setSelectedPeople((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const submitExpense = () => {
    if (!title || !amount || !paidBy || selectedPeople.length === 0) return;

    onAdd({
      id: Date.now(),
      title,
      amount: parseFloat(amount),
      paidBy,
      splitBetween: selectedPeople,
    });

    setTitle("");
    setAmount("");
    setPaidBy("");
    setSelectedPeople([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Add Expense</h2>

        {/* Title */}
        <input
          type="text"
          placeholder="Expense title"
          className="w-full border rounded-md px-3 py-2 mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Amount */}
        <input
          type="number"
          placeholder="Amount"
          className="w-full border rounded-md px-3 py-2 mb-4"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* Paid By */}
        <select
          className="w-full border rounded-md px-3 py-2 mb-4"
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
        >
          <option value="">Who paid?</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Split Between */}
        <p className="font-medium mb-2">Split between:</p>

        <div className="max-h-32 overflow-y-auto border rounded-md p-2 mb-4">
          {people.map((p) => (
            <label key={p.id} className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={selectedPeople.includes(p.id)}
                onChange={() => togglePerson(p.id)}
              />
              {p.name}
            </label>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-3 py-2 border rounded-md">
            Cancel
          </button>
          <button
            onClick={submitExpense}
            className="px-3 py-2 bg-blue-600 text-white rounded-md"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}