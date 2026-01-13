"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../../../lib/supabaseClient"

const BarangayBudgetBreakdown = ({ selectedYear, selectedCategory }) => {
  const [rows, setRows] = useState([])
  const [years, setYears] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const fetchBreakdown = async () => {
    setLoading(true)
    setMessage("")

    const dashboardYear =
      selectedYear === "all" ? null : Number(selectedYear)

    let historyData = []
    let appropriationData = []

    try {
      /* =========================
         1️⃣ HISTORICAL DATA
      ========================= */
      if (dashboardYear === null || dashboardYear >= 2025) {
        const historyEndYear =
          dashboardYear === null
            ? new Date().getFullYear() - 1
            : dashboardYear - 1

        const { data, error } = await supabase
          .from("barangay_budget_breakdown")
          .select("*")
          .gte("year", 2015)
          .lte("year", historyEndYear)

        if (error) throw error

        historyData = data.map(row => ({
          year: row.year,
          category: row.category,
          subcategory: row.subcategory,
          description: row.description,
          amount: Number(row.amount || 0),
          source: "history",
        }))
      }

      /* =========================
         2️⃣ APPROPRIATIONS
      ========================= */
      if (dashboardYear !== null && dashboardYear >= 2026) {
        const appropriationYear = dashboardYear - 1

        const { data, error } = await supabase
          .from("budget_uploads")
          .select("*")
          .eq("year", appropriationYear)

        if (error) throw error

        appropriationData = data.map(row => ({
          year: row.year,
          category: row.category,
          subcategory: row.category, // 🔑 rule enforced
          description: row.description,
          amount: Number(row.amount || 0),
          source: "appropriation",
        }))
      }

      /* =========================
         3️⃣ MERGE + AGGREGATE
      ========================= */
      const merged = [...historyData, ...appropriationData]

      const aggregated = Object.values(
        merged.reduce((acc, row) => {
          const key = `${row.year}|${row.subcategory}|${row.description}`

          if (!acc[key]) acc[key] = { ...row }
          else acc[key].amount += row.amount

          return acc
        }, {})
      )

      setRows(aggregated)

      /* =========================
         4️⃣ FILTER OPTIONS
      ========================= */
      setYears([...new Set(aggregated.map(r => r.year))].sort((a, b) => b - a))
      setCategories([...new Set(aggregated.map(r => r.category))])

    } catch (err) {
      console.error(err)
      setMessage("Failed to load budget data.")
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchBreakdown()
  }, [selectedYear])

  /* =========================
     FILTER VIEW
  ========================= */
  const filteredRows = rows.filter(row => {
    const matchYear =
      selectedYear === "all" || row.year === Number(selectedYear)
    const matchCategory =
      selectedCategory === "all" || row.category === selectedCategory
    return matchYear && matchCategory
  })

  const totalAmount = filteredRows.reduce(
    (sum, r) => sum + r.amount,
    0
  )

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm">

      {/* HEADER */}
      <div className="px-8 py-6 border-b bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">
          Budget Breakdown Report
        </h2>
        <p className="text-sm text-slate-600">
          Historical & Appropriation Summary
        </p>
      </div>

      {/* STATUS */}
      <div className="px-8 py-4 text-sm text-slate-600">
        {filteredRows.length} records shown
      </div>

      {/* TABLE */}
      <div className="px-8 py-6 overflow-x-auto">
        {loading ? (
          <p>Loading…</p>
        ) : message ? (
          <p className="text-red-600">{message}</p>
        ) : filteredRows.length === 0 ? (
          <p className="text-slate-500 italic">No records found.</p>
        ) : (
          <table className="w-full border text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="border p-2">Year</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Description</th>
                <th className="border p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map(row => (
                <tr key={`${row.year}-${row.category}-${row.description}`}>
                  <td className="border p-2">{row.year}</td>
                  <td className="border p-2">{row.category}</td>
                  <td className="border p-2">{row.description}</td>
                  <td className="border p-2 text-right">
                    ₱{row.amount.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100">
              <tr>
                <td colSpan={3} className="border p-2 text-right font-bold">
                  Total
                </td>
                <td className="border p-2 text-right font-bold text-green-700">
                  ₱{totalAmount.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  )
}

export default BarangayBudgetBreakdown
