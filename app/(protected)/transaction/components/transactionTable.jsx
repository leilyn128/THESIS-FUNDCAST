"use client";

import { useState } from "react";
import { Edit3, Trash2, Check, X, Search } from "lucide-react";

// Peso formatter
const currency = (val = 0) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(val);

export default function TransactionTable({
  transactions = [],
  loading,
  onEditTransaction,
  onDeleteTransaction,
  hideActions = false

}) {
  const [editingId, setEditingId] = useState(null);
  const [rowForm, setRowForm] = useState({});

  /* ================= FILTER STATE ================= */
  const [filters, setFilters] = useState({
    type: "all",
    search: "",
    fromDate: "",
    toDate: "",
  });

  /* ================= FILTER LOGIC ================= */
  const filteredTransactions = transactions.filter((t) => {
    if (filters.type === "income" && t.deposit <= 0) return false;
    if (filters.type === "expense" && t.withdrawal <= 0) return false;

    if (filters.fromDate && new Date(t.date) < new Date(filters.fromDate))
      return false;
    if (filters.toDate && new Date(t.date) > new Date(filters.toDate))
      return false;

    if (
      filters.search &&
      !`${t.description ?? ""}`.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;

    return true;
  });

  /* ================= EDIT LOGIC ================= */
  const startEdit = (t) => {
    setEditingId(t.id);
    setRowForm({
      date: t.date,
      description: t.description,
      deposit: t.deposit || "",
      withdrawal: t.withdrawal || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setRowForm({});
  };

  const saveEdit = (id) => {
    onEditTransaction(
      {
        date: rowForm.date,
        description: rowForm.description,
        deposit: Number(rowForm.deposit || 0),
        withdrawal: Number(rowForm.withdrawal || 0),
      },
      id
    );
    cancelEdit();
  };

  
const formatDescription = (text = "") =>
  text
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());


{!hideActions && (
  <th className="px-4 py-2">Actions</th>
)}

{!hideActions && (
  <td className="px-4 py-2">
    {/* edit / delete buttons */}
  </td>
)}
    
 return (
  <div className="print-root bg-white">
    <div className="print-area">

    {/* SCREEN-ONLY SCROLL WRAPPERS */}
    <div className="table-scroll-x overflow-x-auto max-w-full">
      <div className="table-scroll-y max-h-[800px] overflow-y-auto">

        <table className="transactions-table w-full min-w-[900px] text-sm">

<thead className="bg-emerald-50 border-b border-emerald-200 sticky top-0 z-10">
  <tr className="text-slate-700 text-lg font-semibold">
    <th className="px-8 py-5 text-left">Date</th>
    <th className="px-5 py-3 text-left">Description</th>
    <th className="px-5 py-3 text-right">Income</th>
    <th className="px-5 py-3 text-right">Expenses</th>
    <th className="px-5 py-3 text-right">Balance</th>
    <th className="px-10 py-3 text-center">Actions</th>
  </tr>
</thead>


<tbody className="divide-y divide-slate-100 text-[15px] font-medium text-slate-700">
  {filteredTransactions.map((t) => {
    const isEditing = editingId === t.id;

    return (
      <tr
        key={t.id}
        className="hover:bg-slate-50 transition"
      >

        {/* DATE */}
        <td className="px-5 py-4">
          {isEditing ? (
            <input
              type="date"
              value={rowForm.date}
              onChange={(e) =>
                setRowForm({ ...rowForm, date: e.target.value })
              }
              className="border border-slate-300 rounded-md px-2 py-1 w-full text-sm font-normal"
            />
          ) : (
            <span className="font-medium">
              {t.date}
            </span>
          )}
        </td>

        {/* DESCRIPTION */}
        <td className="px-5 py-4">
          {isEditing ? (
            <input
              value={rowForm.description}
              onChange={(e) =>
                setRowForm({ ...rowForm, description: e.target.value })
              }
              className="border border-slate-300 rounded-md px-2 py-1 w-full text-sm font-normal"
            />
          ) : (
            <span className="font-semibold tracking-wide font-variant-small-caps">
              {formatDescription(t.description)}
            </span>
          )}
        </td>

        {/* INCOME */}
        <td className="px-5 py-4 text-right">
          {isEditing ? (
            <input
              type="number"
              value={rowForm.deposit}
              onChange={(e) =>
                setRowForm({ ...rowForm, deposit: e.target.value })
              }
              className="border border-slate-300 rounded-md px-2 py-1 w-full text-right text-sm font-normal"
            />
          ) : t.deposit ? (
            <span className="text-emerald-700 font-semibold">
              {currency(t.deposit)}
            </span>
          ) : (
            <span className="text-slate-400">—</span>
          )}
        </td>

        {/* EXPENSE */}
        <td className="px-5 py-4 text-right">
          {isEditing ? (
            <input
              type="number"
              value={rowForm.withdrawal}
              onChange={(e) =>
                setRowForm({ ...rowForm, withdrawal: e.target.value })
              }
              className="border border-slate-300 rounded-md px-2 py-1 w-full text-right text-sm font-normal"
            />
          ) : t.withdrawal ? (
            <span className="text-rose-700 font-semibold">
              {currency(t.withdrawal)}
            </span>
          ) : (
            <span className="text-slate-400">—</span>
          )}
        </td>

        {/* BALANCE */}
        <td className="px-5 py-4 text-right font-semibold text-slate-800">
          {currency(t.balance)}
        </td>

        {/* ACTIONS */}
        <td className="px-5 py-4 text-center">
          {isEditing ? (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => saveEdit(t.id)}
                className="p-1.5 rounded-md hover:bg-emerald-50 transition"
              >
                <Check size={16} className="text-emerald-600" />
              </button>
              <button
                onClick={cancelEdit}
                className="p-1.5 rounded-md hover:bg-slate-100 transition"
              >
                <X size={16} className="text-slate-600" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => startEdit(t)}
                className="p-1.5 rounded-md hover:bg-slate-100 transition"
              >
                <Edit3 size={15} className="text-slate-600" />
              </button>
              <button
                onClick={() => onDeleteTransaction(t.id)}
                className="p-1.5 rounded-md hover:bg-rose-50 transition"
              >
                <Trash2 size={15} className="text-rose-600" />
              </button>
            </div>
          )}
        </td>

      </tr>
    );
  })}
</tbody>


        </table>

        {loading && (
          <div className="p-4 text-center text-slate-500">
            Loading transactions…
          </div>
        )}

      </div>
    </div>
  </div>
  </div>
);
}