"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function TransactionModal({
  selectedYear,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    date: "",
    description: "",
    deposit: "",
    withdrawal: "",
  });

  // ✅ Default date locked to selected year
  useEffect(() => {
    if (selectedYear) {
      setForm((prev) => ({
        ...prev,
        date: `${selectedYear}-01-01`,
      }));
    }
  }, [selectedYear]);

  // ✅ Validation
  const isValid =
    form.date &&
    form.description &&
    (Number(form.deposit) > 0 || Number(form.withdrawal) > 0) &&
    !(Number(form.deposit) > 0 && Number(form.withdrawal) > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Add Transaction
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-500 hover:text-slate-800" />
          </button>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          <input
            type="date"
            min={`${selectedYear}-01-01`}
            max={`${selectedYear}-12-31`}
            className="border rounded px-3 py-2 text-sm"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
          />

          

          <input
            type="text"
            placeholder="Description"
            className="border rounded px-3 py-2 text-sm md:col-span-2"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          
          
          <input
            type="number"
            placeholder="Income"
            className="border rounded px-3 py-2 text-sm"
            value={form.deposit}
            onChange={(e) =>
              setForm({
                ...form,
                deposit: e.target.value,
                withdrawal: "",
              })
            }
          />

          <input
            type="number"
            placeholder="Expenses"
            className="border rounded px-3 py-2 text-sm"
            value={form.withdrawal}
            onChange={(e) =>
              setForm({
                ...form,
                withdrawal: e.target.value,
                deposit: "",
              })
            }
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-slate-200 hover:bg-slate-300 text-sm"
          >
            Cancel
          </button>

          <button
            disabled={!isValid}
            onClick={() => {
              onSubmit({
                ...form,
                deposit: Number(form.deposit || 0),
                withdrawal: Number(form.withdrawal || 0),
              });
              onClose();
            }}
            className={`px-4 py-2 rounded text-sm text-white
              ${
                isValid
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-slate-400 cursor-not-allowed"
              }`}
          >
            Save Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
