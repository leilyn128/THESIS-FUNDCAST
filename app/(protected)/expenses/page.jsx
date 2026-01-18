"use client";

import { useState, useEffect, useMemo } from "react";

import { useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import BudgetUploadPage from "../expenses/components/budgetUpload";
import { categorizeExpense } from "../dashboard/components/expensePieChart";
import BudgetSummaryCards from "./components/BudgetSummaryCards";
import IncomeComparisonChart from "./components/IncomeComparisonChart";
import { useRouter } from "next/navigation";

/* =========================
   CATEGORY NORMALIZER
========================= */
function normalizeCategory(cat = "") {
  const t = cat.toLowerCase();

  if (
      t.includes("personal")||
      t.includes("mPS")
)
    { return "Personal Services";
    }
  // ✅ FIX MOOE
  if (
    t.includes("mooe") ||
    t.includes("maintenance") ||
    t.includes("operating")
  ) {
    return "MOOE";
  }

  // ✅ FIX SK
  if (
    t.includes("sk") ||
    t.includes("sangguniang kabataan") ||
    t.includes("kabataan")
  ) {
    return "10% SK Fund";
  }

  if (t.includes("20") || t.includes("bdf")) return "20% BDF";
  if (t.includes("gadr") || t.includes("gad")) return "15% GAD";
  if (t.includes("bdr")) return "5% BDRRMF";
  if (t.includes("senior")) return "1% Senior & PWD";

  return cat.trim();
}
/* =========================
   INCOME CATEGORIZER
========================= */
function categorizeIncome(description = "") {
  const t = description.toLowerCase();

  if (t.includes("rpt")) return "RPT Share";
  if (t.includes("ctc")) return "CTC";
  if (t.includes("nta") || t.includes("ira")) return "NTA";
  if (t.includes("subsidy")) return "Subsidy from LGM";
  if (t.includes("clearance") || t.includes("certification"))
    return "Certifications / Clearances";
  if (t.includes("rent")) return "Rent Income";
  if (t.includes("interest")) return "Interest Income";
  if (t.includes("water")) return "Brgy. Water System Income";
  if (t.includes("business")) return "Other Business Income";

  return "Other Income";
}


export default function ExpensesPage() {
  /* =========================
     YEAR
  ========================= */
 const searchParams = useSearchParams();
const yearParam = searchParams.get("year");
const selectedYear = yearParam ? Number(yearParam) : null;
const [editOpen, setEditOpen] = useState(false);
const [deleteLoading, setDeleteLoading] = useState(false);
const [totalBudget, setTotalBudget] = useState("");
const [isBudgetSaved, setIsBudgetSaved] = useState(false);
const router = useRouter();

  /* =========================
     UI STATE (UNCHANGED)
  ========================= */
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
const [selectedSubcategory, setSelectedSubcategory] = useState(null);
const [editAmount, setEditAmount] = useState("");
const [selectedCategory, setSelectedCategory] = useState(null);

  /* =========================
     DATA STATE
  ========================= */
  const [budgetRows, setBudgetRows] = useState([]);
  const [transactions, setTransactions] = useState([]);

  /* =========================
     FETCH BUDGETS
  ========================= */
  const fetchBudgets = async () => {
  const { data, error } = await supabase
    .from("budget_uploads")
    .select("id, year, category, description, amount")
    .eq("year", selectedYear);

  if (error) {
    console.error(error);
    return;
  }

  setBudgetRows(data || []);
};


  /* =========================
     FETCH TRANSACTIONS
  ========================= */
  const fetchTransactions = async () => {
  const start = `${selectedYear}-01-01`;
  const end = `${selectedYear}-12-31`;

  const { data, error } = await supabase
    .from("transactions")
    .select("id, description, withdrawal, date")
    .gte("date", start)
    .lte("date", end);

  if (error) {
    console.error("Transaction fetch error:", error.message);
    return;
  }

  setTransactions(data || []);
};

  /* =========================
     INITIAL LOAD
  ========================= */
useEffect(() => {
  if (!selectedYear) return; // ⛔ do NOT fetch yet

  fetchBudgets();
  fetchTransactions();
  fetchTotalBudget();
}, [selectedYear, refreshKey]);

useEffect(() => {
  if (!searchParams.get("year")) {
    const currentYear = new Date().getFullYear();
    router.replace(`/expenses?year=${currentYear}`);
  }
}, [searchParams, router]);

  /* =========================
     GROUP BUDGETS
  ========================= */
const groupedBudgets = useMemo(() => {
  const map = {};

  budgetRows.forEach((r) => {
    const cat = normalizeCategory(r.category);

    if (!map[cat]) {
      map[cat] = {
        category: cat,
        allocated: 0,
        items: [],
      };
    }

    map[cat].allocated += Number(r.amount) || 0;
    map[cat].items.push(r);
  });

  return Object.values(map).sort(
    (a, b) => b.allocated - a.allocated
  );
}, [budgetRows]);

const normalize = (text = "") =>
  text.toLowerCase().replace(/[^a-z0-9]/g, "");

const expensesBySubcategory = useMemo(() => {
  const map = {};

  transactions.forEach((t) => {
    if (!t.withdrawal || t.withdrawal <= 0) return;

    const tDesc = normalize(t.description);

    budgetRows.forEach((b) => {
      const bDesc = normalize(b.description);

      // ✅ MATCH BOTH DIRECTIONS
      if (tDesc.includes(bDesc) || bDesc.includes(tDesc)) {
        map[b.description] =
          (map[b.description] || 0) + Number(t.withdrawal);
      }
    });
  });

  return map;
}, [transactions, budgetRows]);


useEffect(() => {
  console.log("Grouped Budgets:", groupedBudgets.map(g => g.category));
}, [groupedBudgets]);

/* =========================
   GROUP EXPENSES (CATEGORY)
========================= */
const expensesByCategory = useMemo(() => {
  const map = {};

  transactions.forEach((t) => {
    if (!t.withdrawal || t.withdrawal <= 0) return;

    const raw = categorizeExpense(t.description || "");
    if (!raw) return;

    const cat = normalizeCategory(raw);

    map[cat] = (map[cat] || 0) + Number(t.withdrawal);
  });

  return map;
}, [transactions]);

/* =========================
   ACTUAL INCOME (FROM TRANSACTIONS)
========================= */
const actualIncomeByCategory = useMemo(() => {
  const map = {};

  transactions.forEach((t) => {
    if (!t.deposit || t.deposit <= 0) return;

    const cat = categorizeIncome(t.description || "");
    map[cat] = (map[cat] || 0) + Number(t.deposit);
  });

  return map;
}, [transactions]);


/* =========================
   COMPARISON DATA (FOR CHART)
========================= */
const comparisonData = useMemo(() => {
  return groupedBudgets.map((b) => ({
    category: b.category,
    allocated: b.allocated,
    spent: expensesByCategory[b.category] || 0,
  }));
}, [groupedBudgets, expensesByCategory]);

const handleEdit = (category, currentAmount) => {
  setSelectedCategory(category);
  setEditAmount(currentAmount); // 👈 preload value
  setEditOpen(true);
};

const updateBudget = async () => {
  if (!editAmount || Number(editAmount) <= 0) {
    alert("Enter a valid amount");
    return;
  }

  const { error } = await supabase
    .from("budget_uploads")
    .update({ amount: Number(editAmount) })
    .eq("category", selectedCategory);

  if (error) {
    console.error(error);
    alert("Failed to update budget");
    return;
  }

  setEditOpen(false);
  setEditAmount("");
  setSelectedCategory(null);
  fetchBudgets(); // refresh list
};
/* =========================
   INCOME COMPARISON DATA
========================= */
const incomeComparisonData = useMemo(() => {
  return Object.entries(actualIncomeByCategory).map(
    ([category, actual]) => ({
      category,
      approved: Number(totalBudget) || 0,
      actual,
      balance: (Number(totalBudget) || 0) - actual,
    })
  );
}, [actualIncomeByCategory, totalBudget]);


const handleDelete = (category, allocated, spent) => {
  if (spent > allocated) {
    alert("Cannot delete: budget already used.");
    return;
  }

  if (!confirm(`Delete all budget items under "${category}"?`)) return;

  deleteCategory(category);
};


const deleteCategory = async (category) => {
  setDeleteLoading(true);

  const { error } = await supabase
    .from("budget_uploads")
    .delete()
    .eq("category", category);

  setDeleteLoading(false);

  if (error) {
    console.error(error);
    alert("Delete failed");
    return;
  }

  fetchBudgets();
};
const saveTotalBudget = async () => {
  if (!totalBudget || Number(totalBudget) <= 0) {
    alert("Please enter a valid total budget");
    return;
  }

  const { error } = await supabase
    .from("yearly_budget")
    .upsert(
      {
        year: selectedYear,        // e.g. 2026
        total_income: Number(totalBudget),
      },
      { onConflict: "year" }
    );

  if (error) {
    console.error("Save failed:", error);
    alert("Failed to save total budget");
    return;
  }

  // 🔒 LOCK AFTER SAVE
  setIsBudgetSaved(true);
  alert("Total budget saved successfully");
};


const fetchTotalBudget = async () => {
  const { data, error } = await supabase
    .from("yearly_budget")
    .select("total_income")
    .eq("year", selectedYear)
    .maybeSingle(); // ✅ important

  if (data?.total_income) {
    // ✅ Record exists → lock
    setTotalBudget(data.total_income);
    setIsBudgetSaved(true);
  } else {
    // ✅ No record → unlock
    setTotalBudget("");
    setIsBudgetSaved(false);
  }
};



/* =========================
     UI
  ========================= */
return (
  <div className="min-h-screen bg-slate-50">
    {/* HEADER SECTION */}
    <header className="rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-800 px-8 py-6 text-white shadow-xl">
      
      {/* TOP SECTION: Logo/Title + Action Buttons */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Branding Section */}
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-white/15 p-3 backdrop-blur-sm border border-white/20">
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Budget Allocation</h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 
                       px-5 py-2.5 font-medium text-white transition-all duration-200 
                       hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
          >
            <span className="text-lg">📤</span>
            <span>Upload Budget File</span>
          </button>

          <button
            onClick={() => setShowManualModal(true)}
            className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-semibold 
                       text-emerald-700 transition-all duration-200 hover:bg-slate-50 
                       hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="text-lg">➕</span>
            <span>Add Budget Item</span>
          </button>
        </div>
      </div>

      {/* TOTAL BUDGET CONTROL PANEL */}
      <div className="rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 p-2">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Label and Info */}
          <div className="space-y-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-100">
              Total Annual Budget
            </h2>
            
          </div>

          {/* Input and Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-grow">
  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
    ₱
  </span>

  <input
    type="number"
    placeholder="Enter total budget amount"
    value={totalBudget}
    onChange={(e) => setTotalBudget(e.target.value)}
    disabled={isBudgetSaved}
    className={`w-full sm:w-64 rounded-lg pl-8 pr-4 py-2 text-sm border text-slate-900
      ${isBudgetSaved
        ? "bg-slate-100 cursor-not-allowed text-slate-500"
        : "bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
      }`}
  />
</div>

            
            {!isBudgetSaved && (
  <button
    onClick={saveTotalBudget}
    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
  >
    Save
  </button>
         )}
          </div>

        </div>
      </div>

    </header>

{showUploadModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="mx-4 w-full max-w-lg rounded-2xl bg-white shadow-2xl
                    max-h-[85vh] flex flex-col">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b p-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Upload Budget File
          </h2>
          <p className="text-sm text-slate-500">
            Upload CSV or Excel files for bulk import
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(false)}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          ✕
        </button>
      </div>

      {/* BODY (SCROLLABLE) */}
      <div className="p-6 overflow-y-auto">
        <BudgetUploadPage
          mode="picker"
          selectedYear={selectedYear}
          onSuccess={() => {
            fetchBudgets();
            setRefreshKey((k) => k + 1);
            setShowUploadModal(false);
          }}
        />
      </div>

    </div>
  </div>
)}


      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Add Budget Entry</h2>
                <p className="text-sm text-slate-500">Manually add a new budget allocation</p>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <BudgetUploadPage
                mode="form"
                selectedYear={selectedYear}
                onSuccess={() => {
                  fetchBudgets();
                  setRefreshKey((k) => k + 1);
                  setShowManualModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
{editOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    <div className="w-full max-w-md rounded-xl bg-white p-6">
      <h2 className="text-lg font-semibold mb-4">
        Edit Budget – {selectedCategory}
      </h2>

      <input
        type="number"
        className="w-full rounded-lg border p-2 mb-4"
        placeholder="New Allocated Amount"
        value={editAmount}
        onChange={(e) => setEditAmount(e.target.value)}
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setEditOpen(false)}
          className="px-4 py-2 rounded-lg border"
        >
          Cancel
        </button>

        <button
          onClick={updateBudget}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

      {/* CONTENT */}
      <div className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
          </div>
          <div className="text-sm text-slate-500">
            Showing {groupedBudgets.length} categories
          </div>
        </div>
    
{/*INCOME – APPROVED vs ACTUAL 
<div className="mb-12 rounded-2xl bg-white p-8 shadow-md border">
  <div className="mb-6 flex items-center justify-between">
    <div>
      <h2 className="text-xl font-bold text-slate-800">
        Income – Approved vs Actual
      </h2>
      <p className="text-sm text-slate-500">
        Comparison of planned income vs actual collections
      </p>
    </div>
  </div>

  <div className="w-full h-[420px]">
    <IncomeComparisonChart data={incomeComparisonData} />
  </div>
</div>
*/}


        {/* BUDGET CARDS GRID */}
        {groupedBudgets.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
    {groupedBudgets.map((g) => {
      const isOpen = expandedCategory === g.category;

      // ✅ DEFINE spent HERE (THIS FIXES THE ERROR)
      const spent = expensesByCategory[g.category] || 0;

      return (
        <BudgetSummaryCards
          key={g.category}
          category={g.category}
          allocated={g.allocated}
          spent={spent}
          expensesByCategory={expensesByCategory}
          spentBySubcategory={expensesBySubcategory}

          // ✅ USE g.category (NOT category)
          onEdit={() => handleEdit(g.category)}
          onDelete={() => handleDelete(g.category, g.allocated, spent)}

          onSubcategoryClick={setSelectedSubcategory}
          isOpen={isOpen}
          onToggle={() =>
            setExpandedCategory(isOpen ? null : g.category)
          }
          items={g.items}
        />
      );
    })}
  </div>

        ) : (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-700">No Budget Data</h3>
            <p className="mb-6 text-slate-500">Get started by uploading a file or adding a budget manually</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
              >
                Upload File
              </button>
              <button
                onClick={() => setShowManualModal(true)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Add Budget
              </button>
            </div>
          </div>
        )}

        
            
        
    
      </div>
    </div>
  );
}