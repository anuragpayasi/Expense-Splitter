import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import AddPersonModal from "../components/AddPersonModal";
import AddExpenseModal from "../components/AddExpenseModal";
import jsPDF from "jspdf";

export default function Home() {
  const [personModal, setPersonModal] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);

  const [people, setPeople] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // Add Person
  const addPerson = (name) => {
    if (!name.trim()) return;
    setPeople([...people, { id: Date.now(), name }]);
  };

  // Add Expense
  const addExpense = (data) => {
    setExpenses([...expenses, data]);
  };

  // -----------------------
  // 🧮 SUMMARY CALCULATION
  // -----------------------
  const calculateSummary = () => {
    if (people.length === 0 || expenses.length === 0) return [];

    const paidMap = {};
    people.forEach((p) => (paidMap[p.id] = 0));

    expenses.forEach((e) => {
      paidMap[e.paidBy] += Number(e.amount);
    });

    const totalExpense = expenses.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    );

    const splitAmount = totalExpense / people.length;

    const balance = people.map((p) => ({
      id: p.id,
      name: p.name,
      paid: paidMap[p.id],
      owes: splitAmount - paidMap[p.id],
    }));

    const owes = balance.filter((b) => b.owes > 0);
    const gets = balance.filter((b) => b.owes < 0);

    const finalSettle = [];
    let i = 0,
      j = 0;

    while (i < owes.length && j < gets.length) {
      const owePerson = owes[i];
      const getPerson = gets[j];

      const amount = Math.min(
        owePerson.owes,
        Math.abs(getPerson.owes)
      );

      finalSettle.push({
        from: owePerson.name,
        to: getPerson.name,
        amount: amount.toFixed(2),
      });

      owePerson.owes -= amount;
      getPerson.owes += amount;

      if (owePerson.owes <= 0.01) i++;
      if (getPerson.owes >= -0.01) j++;
    }

    return finalSettle;
  };

  const summary = calculateSummary();

  // --------------
  // FINAL TOTAL UI
  // --------------
  const totalExpense = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );
  const downloadPDF = () => {
  const doc = new jsPDF();
  let y = 10;

  doc.setFontSize(18);
  doc.text("Expense Splitter Summary", 10, y);
  y += 10;

  doc.setFontSize(14);
  doc.text("People:", 10, y);
  y += 8;

  people.forEach((p) => {
    doc.setFontSize(12);
    doc.text(`- ${p.name}`, 12, y);
    y += 6;
  });

  y += 4;
  doc.setFontSize(14);
  doc.text("Expenses:", 10, y);
  y += 8;

  expenses.forEach((e) => {
    doc.setFontSize(12);
    const payer = people.find((p) => p.id === e.paidBy)?.name || "Unknown";
    doc.text(
      `- ${e.title}: ₹${e.amount} (Paid by: ${payer})`,
      12,
      y
    );
    y += 6;
  });

  y += 4;
  doc.setFontSize(14);
  doc.text("Split Summary:", 10, y);
  y += 8;

  summary.forEach((s) => {
    doc.setFontSize(12);
    doc.text(
      `• ${s.from} owes ₹${s.amount} to ${s.to}`,
      12,
      y
    );
    y += 6;
  });

  doc.save("expense-summary.pdf");
};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Expense Splitter 💸
      </h1>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* People Section */}
        <Card className="p-4 shadow-sm border">
          <h2 className="text-xl font-semibold mb-3">People</h2>
          <Button className="w-full" onClick={() => setPersonModal(true)}>
            Add Person
          </Button>

          <ul className="mt-4 space-y-2">
            {people.length === 0 && (
              <p className="text-gray-500 text-sm">No people added yet.</p>
            )}
            {people.map((p) => (
              <li key={p.id} className="p-2 bg-gray-100 rounded border">
                {p.name}
              </li>
            ))}
            
          </ul>
        </Card>

        {/* Expense Section */}
        <Card className="p-4 shadow-sm border">
          <h2 className="text-xl font-semibold mb-3">Expenses</h2>
          <Button className="w-full" onClick={() => setExpenseModal(true)}>
            Add Expense
          </Button>

          <ul className="mt-4 space-y-2">
            {expenses.length === 0 && (
              <p className="text-gray-500 text-sm">No expenses added yet.</p>
            )}
            {expenses.map((e) => (
              <li
                key={e.id}
                className="p-3 bg-gray-100 rounded border flex justify-between"
              >
                <span>
                  <strong>{e.title}</strong> — ₹{e.amount}
                </span>
                <span className="text-sm text-gray-600">
                  Paid by {people.find((p) => p.id === e.paidBy)?.name || "Unknown"}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Summary Section */}
        <Card className="p-4 md:col-span-2 shadow-sm border">
          <h2 className="text-xl font-semibold mb-3">Split Summary</h2>

          {summary.length === 0 && (
            <p className="text-gray-500">
              Add people and expenses to see the summary.
            </p>
          )}

          {summary.map((s, index) => (
            <p key={index} className="p-2 bg-green-50 border rounded mb-2">
              <strong>{s.from}</strong> owes <strong>₹{s.amount}</strong> to{" "}
              <strong>{s.to}</strong>
            </p>
          ))}

          {/* Final Total Section */}
          <div className="mt-6 p-4 bg-white border rounded shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Final Payment Summary</h3>

            <div className="flex justify-between mb-2">
              <span>Total Expense:</span>
              <span className="font-medium">₹{totalExpense}</span>
            </div>

            <div className="flex justify-between">
              <span>People Count:</span>
              <span>{people.length}</span>
            </div>
          </div>
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
      <Button className="mt-4" onClick={downloadPDF}>
  Download PDF
</Button>
    </div>
  );
}