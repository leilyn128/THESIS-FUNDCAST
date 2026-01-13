"use client"
import { useState } from "react"
import { supabase } from "../../../../lib/supabaseClient"

export default function useBreakdownData() {
  const [breakdownData, setBreakdownData] = useState({})

  async function fetchBreakdownData() {
    const { data, error } = await supabase
      .from("barangay_budget_breakdown")
      .select("year, category, subcategory, description, amount")

    if (error) return console.error(error)

    const grouped = {}

    data.forEach(row => {
      const year = Number(row.year)
      if (!grouped[year]) grouped[year] = { income: {}, appropriations: {} }

      const cat = row.category?.toLowerCase().includes("income")
        ? "income"
        : "appropriations"

      const label = row.subcategory || row.description || "Uncategorized"
      const value = Number(String(row.amount).replace(/[^\d.-]/g, ""))

      grouped[year][cat][label] =
        (grouped[year][cat][label] || 0) + value
    })

    setBreakdownData(grouped)
  }

  return { breakdownData, fetchBreakdownData }
}
