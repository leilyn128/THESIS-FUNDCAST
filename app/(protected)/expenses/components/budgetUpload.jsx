"use client";

import { useEffect} from "react";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "../../../../lib/supabaseClient";

const BudgetUploadPage = forwardRef(function BudgetUploadPage(
  { mode = "form", selectedYear, onSuccess }, // 👈 ADD onSuccess
  ref
) {

  const fileInputRef = useRef(null);

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
const [customCategory, setCustomCategory] = useState("");
const [customDescription, setCustomDescription] = useState("");


  useImperativeHandle(ref, () => ({
    openFilePicker() {
      fileInputRef.current?.click();
    },
  }));
const [previousCategories, setPreviousCategories] = useState([]);
const [previousDescriptions, setPreviousDescriptions] = useState([]);

useEffect(() => {
  const loadCategories = async () => {
    const { data, error } = await supabase
      .from("budget_uploads")
      .select("category")
      .eq("year", 2025);

    if (!error && data) {
      const unique = [...new Set(data.map(d => d.category))];
      setPreviousCategories(unique);
    }
  };

  loadCategories();
}, [selectedYear]);



useEffect(() => {
  if (!category || category === "__new__") {
    setPreviousDescriptions([]);
    return;
  }

  const loadDescriptions = async () => {
    const { data, error } = await supabase
      .from("budget_uploads")
      .select("description")
      .eq("year", 2025)
      .eq("category", category);

    if (!error && data) {
      const unique = [...new Set(data.map(d => d.description))];
      setPreviousDescriptions(unique);
    }
  };

  loadDescriptions();
}, [category]);

  /* ================= FILE UPLOAD ================= */
  const handleFile = async (file) => {
    if (!file) return;

    try {
      let records = [];

      if (file.name.endsWith(".csv")) {
        const text = await file.text();
        const rows = text.trim().split(/\r?\n/).slice(1);
        records = rows.map((row) => {
          const r = row.split(",");
          return {
            year: Number(r[0]),
            category: r[1],
            description: r[2],
            amount: Number(r[3]),
          };
        });
      }

      if (file.name.endsWith(".xlsx")) {
        const buffer = await file.arrayBuffer();
        const wb = XLSX.read(buffer, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        records = json.map((row) => ({
  year: selectedYear, // ✅ FORCE DASHBOARD YEAR
  category: row.category,
  description: row.description,
  amount: Number(row.amount),
}));

      }

      await supabase
        .from("budget_uploads")
        .upsert(records, { onConflict: "year,category,description" });
onSuccess?.(); 
      alert(`✅ Uploaded ${records.length} rows`);
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    }
  };

  const handleManualSubmit = async () => {
  const finalCategory =
    category === "__new__" ? customCategory.trim() : category;

  const finalDescription =
    description === "__new__"
      ? customDescription.trim()
      : description;

  if (!finalCategory || !finalDescription || !amount) {
    alert("❌ Please complete all fields.");
    return;
  }

  if (finalCategory === "__new__" || finalDescription === "__new__") {
    alert("❌ Invalid category or description.");
    return;
  }

  const record = {
    year: selectedYear,
    category: finalCategory,        // ✅ CORRECT VALUE
    description: finalDescription,  // ✅ CORRECT VALUE
    amount: Number(amount),
  };

  const { error } = await supabase
    .from("budget_uploads")
    .upsert(record, {
      onConflict: "year,category,description",
    });

  if (error) {
    console.error(error);
    alert("❌ Failed to save record");
    return;
  }

  alert("✅ Budget item saved");

  setCategory("");
  setCustomCategory("");
  setDescription("");
  setCustomDescription("");
  setAmount("");

  onSuccess?.();
};

 return (
  <>
    {/* ALWAYS RENDER FILE INPUT (HIDDEN) */}
    <input
      ref={fileInputRef}
      type="file"
      accept=".csv,.xlsx"
      className="hidden"
      onChange={(e) => handleFile(e.target.files?.[0])}
    />

    {/* ================= PICKER MODE ================= */}
    {mode === "picker" && (
      <div
        className="min-h-[220px] flex flex-col items-center justify-center
                   rounded-lg border-2 border-dashed border-slate-300
                   bg-slate-50 p-8 text-center"
      >
        <p className="mb-4 text-sm text-slate-600">
          Upload a CSV or Excel file
        </p>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold
                     text-white hover:bg-emerald-700 transition"
        >
          📁 Choose File
        </button>

        <p className="mt-3 text-xs text-slate-400">
          Supported formats: .csv, .xlsx
        </p>
      </div>
    )}

    {/* ================= FORM MODE ================= */}
    {mode === "form" && (
      <div className="space-y-4">
        {/* CATEGORY */}
        <div>
          <label className="text-xs font-medium text-slate-600">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (e.target.value !== "__new__") {
                setCustomCategory("");
              }
            }}
            className="border rounded px-3 py-2 text-sm w-full"
          >
            <option value="">Select Category</option>

            {previousCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}

            <option value="__new__">➕ Add new category</option>
          </select>

          {category === "__new__" && (
            <input
              type="text"
              placeholder="Enter new category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-full mt-1"
            />
          )}
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-xs font-medium text-slate-600">
            Description
          </label>

          {previousDescriptions.length > 0 && (
            <select
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-full"
            >
              <option value="">Select Description</option>

              {previousDescriptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}

              <option value="__new__">➕ Add new description</option>
            </select>
          )}

          {(description === "__new__" ||
            previousDescriptions.length === 0) && (
            <input
              type="text"
              placeholder="Enter description"
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-full mt-1"
            />
          )}
        </div>

        {/* AMOUNT */}
        <div>
          <label className="text-xs font-medium text-slate-600">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end">
          <button
            onClick={handleManualSubmit}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg
                       font-semibold hover:bg-emerald-700"
          >
            💾 Save Budget Item
          </button>
        </div>
      </div>
    )}
  </>
);
});
  
export default BudgetUploadPage;
