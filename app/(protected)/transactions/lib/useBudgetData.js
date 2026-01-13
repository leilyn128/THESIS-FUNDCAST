"use client"
import { useState } from "react"
import { supabase } from "../../../../lib/supabaseClient"

export default function useBudgetData() {
  const [budgetData, setBudgetData] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchBudgetData() {
    setLoading(true)

    const { data, error } = await supabase
      .from("yearly_budget")
      .select("year,total_income")
      .order("year", { ascending: true })

    setLoading(false)
    if (error) return console.error(error)

    setBudgetData(
      data.map(d => ({
        year: Number(d.year),
        totalIncome: Number(d.total_income)
      }))
    )
  }

  return { budgetData, loading, fetchBudgetData }
}
