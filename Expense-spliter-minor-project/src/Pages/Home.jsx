import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import AddPersonModal from "../components/AddPersonModal";
import AddExpenseModal from "../components/AddExpenseModal";

export default function Home() {
  // States
  const [personModal, setPersonModal] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);

  const [people, setPeople] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // Add Person
  const addPerson = (name) => {
    if (name.trim() !== "") {
      setPeople([...people, { id: Date.now(), name }]);
    }
  };

  // Add Expense
  const addExpense = (expenseData) => {
    setExpenses([...expenses, expenseData]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center mb-6">
        Expense Splitter 💸
      </h1>

      {/* Layout */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* People Section */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-3">People</h2>

          <Button className="w-full" onClick={() => setPersonModal(true)}>
            Add Person
          </Button>

          {/* People List */}
          <ul className="mt-4 space-y-2">
            {people.length === 0 && (
              <p className="text-gray-500 text-sm">No people added yet.</p>
            )}
            {people.map((p) => (
              <li key={p.id} className="p-2 bg-gray-100 rounded-md">
                {p.name}
              </li>
            ))}
          </ul>
        </Card>

        {/* Expense Section */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-3">Expenses</h2>

          <Button className="w-full" onClick={() => setExpenseModal(true)}>
            Add Expense
          </Button>

          {/* Expense List */}
          <ul className="mt-4 space-y-2">
            {expenses.length === 0 && (
              <p className="text-gray-500 text-sm">No expenses added yet.</p>
            )}

            {expenses.map((e) => (
              <li
                key={e.id}
                className="p-3 bg-gray-100 rounded-md flex justify-between"
              >
                <span>
                  <strong>{e.title}</strong> — ₹{e.amount}
                </span>
                <span className="text-sm text-gray-600">
                  Paid by{" "}
                  {people.find((p) => p.id === e.paidBy)?.name || "Unknown"}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Split Summary Section */}
        <Card className="p-4 md:col-span-2">
          <h2 className="text-xl font-semibold mb-3">Split Summary</h2>
          <p className="text-gray-600">Summary will be generated later.</p>
        </Card>
      </div>

      {/* Modals */}
      <AddPersonModal
        open={personModal}
        onClose={() => setPersonModal(false)}
        onAdd={addPerson}
      />

      <AddExpenseModal
        open={expenseModal}
        onClose={() => setExpenseModal(false)}
        onAdd={addExpense}
        people={people}
      />
    </div>
  );
}