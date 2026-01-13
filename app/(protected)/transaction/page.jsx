"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import TransactionTable from "../transaction/components/transactionTable";
import TransactionModal from "../transaction/components/transactionModal";
import { useCashflowData } from "../dashboard/components/useCashflowData";
import * as XLSX from "xlsx";

export default function TransactionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [exportLoading, setExportLoading] = useState(false);
  const [exportType, setExportType] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // =========================
  // YEAR (SYNCED WITH DASHBOARD)
  // =========================
  const START_YEAR = 2025;
  const currentYear = new Date().getFullYear();

  const yearFromUrl = Number(searchParams.get("year"));
  const selectedYear =
    yearFromUrl && yearFromUrl >= START_YEAR
      ? yearFromUrl
      : currentYear >= START_YEAR
      ? currentYear
      : START_YEAR;

  // =========================
  // DATA FETCH
  // =========================
  const {
    transactions: fetchedTransactions,
    loading,
    refetch,
  } = useCashflowData(selectedYear);

  const [transactions, setTransactions] = useState([]);

  // =========================
  // BALANCE RECALCULATION (CORE FIX)
  // =========================
  const recalculateBalances = (txns) => {
    let runningBalance = 0;

    return txns.map((t, index) => {
      // Beginning balance (first row, deposit only)
      if (index === 0 && t.deposit > 0 && !t.withdrawal) {
        runningBalance = t.deposit;
        return { ...t, balance: runningBalance };
      }

      runningBalance += (t.deposit || 0) - (t.withdrawal || 0);
      return { ...t, balance: runningBalance };
    });
  };

  // =========================
  // APPLY RECALCULATION (NO SORT)
  // =========================
useEffect(() => {
  if (!fetchedTransactions) return;

  // 🔹 2025 = legacy data → trust DB balances
  if (selectedYear === 2025) {
    setTransactions(fetchedTransactions);
    return;
  }

  // 🔹 2026+ = new rules → recalculate balances
  const recalculated = recalculateBalances(fetchedTransactions);
  setTransactions(recalculated);

}, [fetchedTransactions, selectedYear]);

  // =========================
  // ADD TRANSACTION
  // =========================
  const handleAddTransaction = async (newTransaction) => {
    try {
      const transactionDate = newTransaction.date
        ? newTransaction.date
        : `${selectedYear}-01-01`;

      const transactionToInsert = {
        ...newTransaction,
        date: transactionDate,
      };

      const { error } = await supabase
        .from("transactions")
        .insert([transactionToInsert]);

      if (error) throw error;

      refetch();
    } catch (err) {
      console.error("Add transaction failed:", err.message);
      alert("Error adding transaction.");
    }
  };

  // =========================
  // DELETE TRANSACTION
  // =========================
  const handleDeleteTransaction = async (id) => {
    if (!id) return;
    if (!window.confirm("Delete this transaction?")) return;

    try {
      await supabase.from("transactions").delete().eq("id", id);

      const updated = transactions.filter((t) => t.id !== id);
      const recalculated = recalculateBalances(updated);

      setTransactions(recalculated);

      // Sync balances
      for (const t of recalculated) {
        await supabase
          .from("transactions")
          .update({ balance: t.balance })
          .eq("id", t.id);
      }

      refetch();
    } catch (err) {
      console.error("Delete failed:", err.message);
      alert("Error deleting transaction.");
    }
  };

  // =========================
  // EDIT TRANSACTION
  // =========================
  const handleEditTransaction = async (updatedTransaction, id) => {
    try {
      const updated = transactions.map((t) =>
        t.id === id ? { ...t, ...updatedTransaction } : t
      );

      const recalculated = recalculateBalances(updated);
      setTransactions(recalculated);

      // Sync all balances
      for (const t of recalculated) {
        await supabase
          .from("transactions")
          .update({ balance: t.balance })
          .eq("id", t.id);
      }

      refetch();
    } catch (err) {
      console.error("Edit failed:", err.message);
      alert("Error updating transaction.");
    }
  };

  // =========================
  // EXPORT (FILTER AWARE)
  // =========================
  const handleExportExcel = async () => {
    try {
      setExportLoading(true);

      let query = supabase
        .from("transactions")
        .select("*")
        .gte("date", `${selectedYear}-01-01`)
        .lte("date", `${selectedYear}-12-31`);

      if (exportType === "income") query = query.gt("deposit", 0);
      if (exportType === "expense") query = query.gt("withdrawal", 0);

      const { data, error } = await query;
      if (error) throw error;

      if (!data || data.length === 0) {
        alert(`No ${exportType} data for ${selectedYear}`);
        return;
      }

      const formatted = data.map((t) => ({
        Date: t.date,
        Description: t.description || "",
        Income: t.deposit ?? 0,
        Expenses: t.withdrawal ?? 0,
        Balance: t.balance ?? 0,
      }));

      const worksheet = XLSX.utils.json_to_sheet(formatted);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

      XLSX.writeFile(
        workbook,
        `transactions_${exportType}_${selectedYear}.xlsx`
      );

      alert("Export successful!");
    } catch (err) {
      console.error(err);
      alert("Export failed.");
    } finally {
      setExportLoading(false);
    }
  };


  // =========================
  const filteredTransactions = transactions.filter((t) => {
    if (exportType === "income") return (t.deposit || 0) > 0;
    if (exportType === "expense") return (t.withdrawal || 0) > 0;
    return true;
  });


 return (
  <div className="w-full">

    {/* HEADER (HIDDEN ON PRINT) */}
    <div
      className="
        print:hidden
        flex flex-col gap-4
        rounded-2xl
        bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-700
        px-6 py-5
        shadow-sm
      "
    >
      {/* TITLE ROW */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-semibold text-white">
          Transactions
          <span className="ml-2 text-emerald-200 text-lg font-medium">
            ({selectedYear})
          </span>
        </h1>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 shadow"
          >
            ➕ Add Transaction
          </button>

          {/* EXPORT GROUP */}
          <div className="flex items-center gap-2">
           <select
  value={exportType}
  onChange={(e) => setExportType(e.target.value)}
  className="
    px-4 py-2
    rounded-lg
    bg-white
    border border-emerald-300
    text-sm font-medium text-emerald-800
    shadow-sm
    focus:outline-none
    focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
    hover:border-emerald-400
    transition
  "
>
  <option value="all">All Transactions</option>
  <option value="income">Income </option>
  <option value="expense">Expenses </option>
</select>


            <button
              onClick={handleExportExcel}
              disabled={exportLoading}
              className={`px-4 py-2 rounded-lg font-medium text-white shadow
                ${
                  exportLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }
              `}
            >
              {exportLoading ? "Exporting..." : "📤 Export"}
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-slate-700 text-white font-medium hover:bg-slate-800 shadow"
          >
            🖨️ Print
          </button>
        </div>
      </div>

      
    </div>

    {/* TABLE (PRINT AREA) */}
    <div className="print-area bg-white rounded-xl shadow p-6 border border-slate-200 mt-5">
      <TransactionTable
  transactions={filteredTransactions}
  loading={loading}
  setTransactions={setTransactions}
  onAddTransaction={handleAddTransaction}
  onDeleteTransaction={handleDeleteTransaction}
  onEditTransaction={handleEditTransaction}
/>

    </div>

    {/* MODAL */}
    {showAddModal && (
      <TransactionModal
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddTransaction}
      />
    )}

  </div>
);
}