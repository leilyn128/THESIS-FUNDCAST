"use client"

import { useEffect, useMemo, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { useCashflowData } from "../../dashboard/components/useCashflowData"
import { categorizeIncome } from "../../dashboard/components/incomePieChart"

const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL",
  "MAY", "JUNE", "JULY", "AUGUST",
  "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
]

const formatMoney = (num) =>
  Number(num || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

export default function TransactionsPrintPage() {
  const searchParams = useSearchParams()
  const year = Number(searchParams.get("year"))
const rawType = searchParams.get("type") || "income"
const type = ["income", "expense", "all"].includes(rawType)
  ? rawType
  : "income"
  const { transactions, loading } = useCashflowData(year)

  // ✅ FIX: print ONLY ONCE
  const hasPrinted = useRef(false)

  useEffect(() => {
    if (!loading && transactions.length > 0 && !hasPrinted.current) {
      hasPrinted.current = true
      setTimeout(() => window.print(), 500)
    }
  }, [loading, transactions])
useEffect(() => {
  const closeAfterPrint = () => {
    setTimeout(() => {
      window.close()
    }, 300)
  }

  window.addEventListener("afterprint", closeAfterPrint)

  return () => {
    window.removeEventListener("afterprint", closeAfterPrint)
  }
}, [])

  // =========================
  // GROUP BY MONTH
  // =========================
  const monthlyData = useMemo(() => {
  const income = {}
  const expense = {}

  transactions.forEach((t) => {
    const date = new Date(t.date)
    const month = MONTHS[date.getMonth()]

    // INCOME
    if (t.deposit > 0) {
      const cat = categorizeIncome(t.description || "")
      if (!income[month]) income[month] = {}
      income[month][cat] =
        (income[month][cat] || 0) + Number(t.deposit)
    }

    // EXPENSE (NO CATEGORIZER)
    if (t.withdrawal > 0) {
      if (!expense[month]) expense[month] = {}
      expense[month][t.description || "Other Expense"] =
        (expense[month][t.description || "Other Expense"] || 0) +
        Number(t.withdrawal)
    }
  })

  return { income, expense }
}, [transactions])

  if (loading) return null

  return (
    <div className="print-root min-h-screen p-10 bg-white text-black text-[14px] leading-6">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="font-bold uppercase">
          Barangay Treasurer’s Report
        </h1>
        <p className="uppercase">
          {type === "expense" ? "Disbursements" : "Income Collections"} – {year}
        </p>
      </div>

      <div className="space-y-12">

  {(type === "income" || type === "all") && (
    <>
      <h2 className="font-bold uppercase text-center">
        INCOME COLLECTIONS
      </h2>

      {Object.entries(monthlyData.income).map(([month, categories]) => {
        const total = Object.values(categories).reduce((s, v) => s + v, 0)

        return (
          <div key={month}>
            <h3 className="font-bold uppercase mb-3">
              {month} {year} COLLECTIONS:
            </h3>

            <div className="pl-6 space-y-1">
              {Object.entries(categories).map(([cat, amount]) => (
                <div key={cat} className="flex justify-between">
                  <span>{cat} --------------------</span>
                  <span>{formatMoney(amount)}</span>
                </div>
              ))}

              <div className="flex justify-between font-bold pt-2 border-t border-black">
                <span>Total</span>
                <span>{formatMoney(total)}</span>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )}

  {(type === "expense" || type === "all") && (
    <>
      <h2 className="font-bold uppercase text-center mt-16">
        DISBURSEMENTS
      </h2>

      {Object.entries(monthlyData.expense).map(([month, entries]) => {
        const total = Object.values(entries).reduce((s, v) => s + v, 0)

        return (
          <div key={month}>
            <h3 className="font-bold uppercase mb-3">
              {month} {year} DISBURSEMENTS:
            </h3>

            <div className="pl-6 space-y-1">
              {Object.entries(entries).map(([label, amount]) => (
                <div key={label} className="flex justify-between">
                  <span>{label} --------------------</span>
                  <span>{formatMoney(amount)}</span>
                </div>
              ))}

              <div className="flex justify-between font-bold pt-2 border-t border-black">
                <span>Total</span>
                <span>{formatMoney(total)}</span>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )}
</div>
</div>

  )
}
