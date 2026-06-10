import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiDownload, FiPlus, FiTrash2, FiUsers } from "react-icons/fi";
import Button from '../Components/ui/Button'
import { Card } from "../components/ui/Card";
import AddPersonModal from "../components/AddPersonModal";
import AddExpenseModal from "../components/AddExpenseModal";
import jsPDF from "jspdf";

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const listVariants = {
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

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

  const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

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
      doc.text(`- ${e.title} ₹${e.amount} (Paid by ${payer})`, 18, y);
      y += 6;
    });

    y += 5;

    // SUMMARY
    doc.setFontSize(14);
    doc.text("Split Summary", 14, y);
    y += 8;

    summary.forEach((s) => {
      doc.setFontSize(11);
      doc.text(`${s.from} pays ₹${s.amount} to ${s.to}`, 18, y);
      y += 6;
    });

    doc.save("expense-summary.pdf");
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#0D0F12] px-4 py-8 text-slate-100 sm:px-6">
      <div className="pointer-events-none fixed inset-0 -z-0 bg-[radial-gradient(circle_at_22%_20%,rgba(45,212,191,0.16),transparent_28rem),radial-gradient(circle_at_80%_10%,rgba(139,92,246,0.14),transparent_26rem)]" />

      <motion.header
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="relative z-10 mx-auto mb-8 max-w-5xl text-center"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-teal-300/80">
          Smart settlement dashboard
        </p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          Expense Splitter
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
          Track people, log expenses, and settle balances with a clean premium workspace.
        </p>
      </motion.header>

      <div className="relative z-10 mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        {/* PEOPLE */}
        <Card className="p-5">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Contacts
                </p>
                <h2 className="mt-1 text-xl font-semibold text-white">People</h2>
              </div>
              <span className="rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs font-semibold text-teal-200">
                {people.length}
              </span>
            </div>

            <Button onClick={() => setPersonModal(true)} className="w-full">
              <FiPlus />
              Add Person
            </Button>

            <motion.ul
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="mt-5 space-y-3"
            >
              {people.length === 0 && (
                <p className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-slate-500">
                  No people added
                </p>
              )}

              {people.map((p) => (
                <motion.li
                  key={p.id}
                  variants={itemVariants}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-3 text-sm text-slate-100 shadow-[0_12px_32px_rgba(0,0,0,0.18)]"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-2xl bg-teal-300/10 text-teal-200">
                      <FiUsers />
                    </span>
                    {p.name}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => deletePerson(p.id)}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-rose-400/20 bg-rose-400/10 text-rose-300 transition hover:bg-rose-400/15"
                    aria-label={`Delete ${p.name}`}
                  >
                    <FiTrash2 />
                  </motion.button>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </Card>

        {/* EXPENSES */}
        <Card className="p-5">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Activity
                </p>
                <h2 className="mt-1 text-xl font-semibold text-white">Expenses</h2>
              </div>
              <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-xs font-semibold text-violet-200">
                {expenses.length}
              </span>
            </div>

            <Button onClick={() => setExpenseModal(true)} className="w-full">
              <FiPlus />
              Add Expense
            </Button>

            <motion.ul
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="mt-5 space-y-3"
            >
              {expenses.length === 0 && (
                <p className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-slate-500">
                  No expenses added
                </p>
              )}

              {expenses.map((e) => (
                <motion.li
                  key={e.id}
                  variants={itemVariants}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-3 text-sm shadow-[0_12px_32px_rgba(0,0,0,0.18)]"
                >
                  <span className="min-w-0 text-slate-100">
                    <span className="block truncate font-medium">{e.title}</span>
                    <span className="text-xs text-slate-500">₹{e.amount}</span>
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-slate-300">
                    {people.find((p) => p.id === e.paidBy)?.name || "Unknown"}
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => deleteExpense(e.id)}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-rose-400/20 bg-rose-400/10 text-rose-300 transition hover:bg-rose-400/15"
                    aria-label={`Delete ${e.title}`}
                  >
                    <FiTrash2 />
                  </motion.button>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </Card>

        {/* SUMMARY */}
        <Card className="p-5 md:col-span-2">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.55, delay: 0.16, ease: "easeOut" }}
          >
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Settlement
                </p>
                <h2 className="mt-1 text-xl font-semibold text-white">Split Summary</h2>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3">
                <p className="text-xs text-slate-500">Total Expense</p>
                <p className="text-2xl font-semibold text-white">₹{totalExpense}</p>
              </div>
            </div>

            {summary.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-slate-500">
                Add data to see summary
              </p>
            ) : (
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {summary.map((s, i) => (
                  <motion.p
                    key={i}
                    variants={itemVariants}
                    className="flex flex-col gap-2 rounded-2xl border border-teal-300/15 bg-teal-300/[0.07] p-4 text-sm text-slate-200 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span>
                      <b className="text-white">{s.from}</b> pays{" "}
                      <b className="text-teal-200">₹{s.amount}</b> to{" "}
                      <b className="text-white">{s.to}</b>
                    </span>
                    <span className="w-fit rounded-full border border-teal-300/20 bg-[#0D0F12]/60 px-3 py-1 text-xs font-semibold text-teal-200">
                      Settle
                    </span>
                  </motion.p>
                ))}
              </motion.div>
            )}

            <div className="mt-5 text-right">
              <Button onClick={downloadPDF}>
                <FiDownload />
                Download PDF
              </Button>
            </div>
          </motion.div>
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
