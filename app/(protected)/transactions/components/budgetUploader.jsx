"use client"

import Papa from "papaparse"
import * as XLSX from "xlsx"
import { supabase } from "../../../../lib/supabaseClient"
import { useEffect, useState } from "react"

export default function BudgetUploader({ refresh }) {
  const [uploading, setUploading] = useState(false)
  const [adding, setAdding] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [budgets, setBudgets] = useState([])

  const [year, setYear] = useState("")
  const [amount, setAmount] = useState("")
  const [forecastYears, setForecastYears] = useState(3) // default 5 years

  // =============================
  // LOAD EXISTING BUDGETS
  // =============================
  async function loadBudgets() {
    const { data, error } = await supabase
      .from("yearly_budget")
      .select("*")
      .order("year", { ascending: true })

    if (!error) setBudgets(data)
  }

  useEffect(() => {
    loadBudgets()
  }, [])

}