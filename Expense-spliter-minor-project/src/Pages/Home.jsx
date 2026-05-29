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

  // ---------------- ADD PERSON ----------------
  const addPerson = (name) => {
    if (!name.trim()) return;
    setPeople([...people, { id: Date.now(), name }]);
  };

  // ---------------- ADD EXPENSE ----------------
  const addExpense = (data) => {
    setExpenses([...expenses, { ...data, id: Date.now() }]);
  };

  // ---------------- DELETE ----------------
  const deletePerson = (id) => {
    setPeople(people.filter((p) => p.id !== id));
    setExpenses(expenses.filter((e) => e.paidBy !== id));
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  // ---------------- SUMMARY LOGIC ----------------
const calculateSummary = () => {
  if (people.length === 0 || expenses.length === 0) return [];

  const paidMap = {};
  const shareMap = {};

  // INIT
  people.forEach((p) => {
    paidMap[p.id] = 0;
    shareMap[p.id] = 0;
  });

  // STEP 1: CALCULATE PAID + SHARE
  expenses.forEach((e) => {
    const participants = e.participants || [];

    if (participants.length === 0) return;

    const share = Number(e.amount) / participants.length;

    // paid by person
    paidMap[e.paidBy] += Number(e.amount);

    // split among selected users
    participants.forEach((pid) => {
      shareMap[pid] += share;
    });
  });

  // STEP 2: BALANCE CALCULATION
  const balance = people.map((p) => {
    const net = paidMap[p.id] - shareMap[p.id];

    return {
      id: p.id,
      name: p.name,
      balance: net, // + gets money, - owes money
    };
  });

  // STEP 3: SEPARATE OWES & GETS
  const owes = balance
    .filter((b) => b.balance < 0)
    .map((b) => ({ ...b, balance: Math.abs(b.balance) }));

  const gets = balance.filter((b) => b.balance > 0);

  // STEP 4: SETTLEMENT LOGIC
  const result = [];

  let i = 0,
    j = 0;

  while (i < owes.length && j < gets.length) {
    const owe = owes[i];
    const get = gets[j];

    const amount = Math.min(owe.balance, get.balance);

    result.push({
      from: owe.name,
      to: get.name,
      amount: amount.toFixed(2),
    });

    owe.balance -= amount;
    get.balance -= amount;

    if (owe.balance <= 0.01) i++;
    if (get.balance <= 0.01) j++;
  }

  return result;
};

  const summary = calculateSummary();

  const totalExpense = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  // ---------------- PDF ----------------
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, 210, 297, "F");

    let y = 15;

    doc.setFontSize(20);
    doc.text("Expense Splitter Summary", 14, y);
    y += 10;

    // PEOPLE
    doc.setFontSize(14);
    doc.text("People", 14, y);
    y += 8;

    people.forEach((p) => {
      doc.setFontSize(11);
      doc.text(`- ${p.name}`, 18, y);
      y += 6;
    });

    y += 5;

    // EXPENSES
    doc.setFontSize(14);
    doc.text("Expenses", 14, y);
    y += 8;

    expenses.forEach((e) => {
      const payer = people.find((p) => p.id === e.paidBy)?.name || "Unknown";
      doc.setFontSize(11);
      doc.text(
        `- ${e.title} ₹${e.amount} (Paid by ${payer})`,
        18,
        y
      );
      y += 6;
    });

    y += 5;

    // SUMMARY
    doc.setFontSize(14);
    doc.text("Split Summary", 14, y);
    y += 8;

    summary.forEach((s) => {
      doc.setFontSize(11);
      doc.text(
        `${s.from} pays ₹${s.amount} to ${s.to}`,
        18,
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

        {/* PEOPLE */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-3">People</h2>

          <Button onClick={() => setPersonModal(true)} className="w-full">
            Add Person
          </Button>

          <ul className="mt-4 space-y-2">
            {people.length === 0 && (
              <p className="text-gray-500 text-sm">No people added</p>
            )}

            {people.map((p) => (
              <li
                key={p.id}
                className="flex justify-between p-2 bg-gray-100 rounded"
              >
                {p.name}
                <button
                  onClick={() => deletePerson(p.id)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {/* EXPENSES */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-3">Expenses</h2>

          <Button onClick={() => setExpenseModal(true)} className="w-full">
            Add Expense
          </Button>

          <ul className="mt-4 space-y-2">
            {expenses.length === 0 && (
              <p className="text-gray-500 text-sm">No expenses added</p>
            )}

            {expenses.map((e) => (
              <li
                key={e.id}
                className="flex justify-between p-2 bg-gray-100 rounded"
              >
                <span>
                  {e.title} - ₹{e.amount}
                </span>

                <span className="text-sm text-gray-500">
                  {people.find((p) => p.id === e.paidBy)?.name || "Unknown"}
                </span>

                <button
                  onClick={() => deleteExpense(e.id)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {/* SUMMARY */}
        <Card className="p-4 md:col-span-2">
          <h2 className="text-xl font-semibold mb-3">Split Summary</h2>

          <p className="mb-3">
            Total Expense: <b>₹{totalExpense}</b>
          </p>

          {summary.length === 0 ? (
            <p className="text-gray-500">Add data to see summary</p>
          ) : (
            summary.map((s, i) => (
              <p key={i} className="p-2 bg-green-50 mb-2 rounded">
                <b>{s.from}</b> pays <b>₹{s.amount}</b> to <b>{s.to}</b>
              </p>
            ))
          )}

          <div className="mt-4 text-right">
            <Button onClick={downloadPDF}>
              Download PDF 📄
            </Button>
          </div>
        </Card>
      </div>

      {/* MODALS */}
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