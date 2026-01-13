(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/thesis/app/(protected)/dashboard/components/useCashflowData.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCashflowData",
    ()=>useCashflowData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/lib/supabaseClient.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function useCashflowData() {
    _s();
    const [transactions, setTransactions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [chartData, setChartData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCashflowData.useEffect": ()=>{
            fetchCashflow();
        }
    }["useCashflowData.useEffect"], []);
    const fetchCashflow = async ()=>{
        setLoading(true);
        // 1️⃣ Fetch transactions from Supabase
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("transactions").select("*").order("date", {
            ascending: true
        });
        if (error) {
            console.error("❌ Supabase fetch error:", error.message);
            setLoading(false);
            return;
        }
        // 2️⃣ Clean deposit and withdrawal values
        const mapped = (data || []).filter((row)=>row.date).map((row)=>({
                ...row,
                deposit: Number(String(row.deposit || "0").replace(/[₱, ]/g, "")),
                withdrawal: Number(String(row.withdrawal || "0").replace(/[₱, ]/g, "")),
                balance: Number(String(row.balance || "0").replace(/[₱, ]/g, ""))
            }));
        // 3️⃣ Save raw transactions for table
        setTransactions(mapped);
        // 4️⃣ Aggregate chart data per month
        const grouped = {};
        mapped.forEach((t)=>{
            const d = new Date(t.date);
            const monthKey = "".concat(d.toLocaleString("default", {
                month: "short"
            }), " ").concat(d.getFullYear());
            if (!grouped[monthKey]) grouped[monthKey] = {
                month: monthKey,
                income: 0,
                expense: 0,
                balance: 0
            };
            grouped[monthKey].income += t.deposit || 0;
            grouped[monthKey].expense += t.withdrawal || 0;
            // Take the last transaction's Supabase balance in the month
            grouped[monthKey].balance = t.balance || grouped[monthKey].balance;
        });
        const monthlyArray = Object.values(grouped).sort((a, b)=>new Date("".concat(a.month)) - new Date("".concat(b.month))).map((g)=>({
                ...g,
                net: g.income - g.expense
            }));
        setChartData(monthlyArray);
        setLoading(false);
    };
    return {
        transactions,
        chartData,
        loading,
        refetch: fetchCashflow
    };
}
_s(useCashflowData, "m24nZmXM+PvQZit500z25WDRs/4=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/thesis/app/(protected)/transaction/components/transactionModal.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TransactionModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function TransactionModal(param) {
    let { onClose, onSubmit } = param;
    _s();
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        date: "",
        description: "",
        deposit: "",
        withdrawal: ""
    });
    const updateField = (field, value)=>{
        setForm((prev)=>({
                ...prev,
                [field]: value,
                ...field === "deposit" ? {
                    withdrawal: ""
                } : {},
                ...field === "withdrawal" ? {
                    deposit: ""
                } : {}
            }));
    };
    const handleSubmit = (e)=>{
        e.preventDefault();
        const newTx = {
            date: form.date,
            description: form.description,
            deposit: Number(form.deposit) || 0,
            withdrawal: Number(form.withdrawal) || 0
        };
        onSubmit(newTx);
        onClose();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/40 flex items-center justify-center z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fadeIn",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-xl font-semibold mb-4 text-emerald-700",
                    children: "➕ Add New Transaction"
                }, void 0, false, {
                    fileName: "[project]/thesis/app/(protected)/transaction/components/transactionModal.jsx",
                    lineNumber: 42,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    className: "space-y-4",
                    onSubmit: handleSubmit,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium mb-1",
                                    children: "Date"
                                }, void 0, false, {
                                    fileName: "[project]/thesis/app/(protected)/transaction/components/transactionModal.jsx",
                                    lineNumber: 50,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "date",
                                    value: form.date,
                                    onChange: (e)=>updateField("date", e.target.value),
                                    required: true,
                                    className: "w-full border rounded-lg px-3 py-2"
                                }, void 0, false, {
                                    fileName: "[project]/thesis/app/(protected)/transaction/components/transactionModal.jsx",
                                    lineNumber: 51,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/thesis/app/(protected)/transaction/components/transactionModal.jsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium mb-1",
                                    children: "Description"
                                }, void 0, false, {
                                    fileName: "[project]/thesis/app/(protected)/transaction/components/transactionModal.jsx",
                                    lineNumber: 61,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: form.description,
                                    onChange: (e)=>updateField("description", e.target.value),
                                    required: true,
                                    className: "w-full border rounded-lg px-3 py-2"
                                }, void 0, false, {
                                    fileName: "[project]/thesis/app/(protected)/transaction/components/transactionModal.jsx",
                                    lineNumber: 62,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/thesis/app/(protected)/transaction/components/transactionModal.jsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium mb-1",
                                            children: "Deposit (₱)"
                                        }, void 0, false, {
                                            fileName: "[project]/thesis/app/(protected)/transaction/components/transactionModal.jsx",
                                            lineNumber: 73,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            value: form.deposit,
                                            onChange: (e)=>updateField("deposit", e.target.value),
                                            disabled: !!form.withdrawal,
                                            className: "w-full border rounded-lg px-3 py-2"
                                        }, void 0, false, {
                                            fileName: "[project]/thesis/app/(protected)/transaction/components/transactionModal.jsx",
                                            lineNumber: 74,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/thesis/app/(protected)/transaction/components/transactionModal.jsx",
                                    lineNumber: 72,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium mb-1",
                                            children: "Withdrawal (₱)"
                                        }, void 0, false, {
                                            fileName: "[project]/thesis/app/(protected)/transaction/components/transactionModal.jsx",
                                            lineNumber: 84,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            value: form.withdrawal,
                                            onChange: (e)=>updateField("withdrawal", e.target.value),
                                            disabled: !!form.deposit,
                                            className: "w-full border rounded-lg px-3 py-2"
                                        }, void 0, false, {
                                            fileName: "[project]/thesis/app/(protected)/transaction/components/transactionModal.jsx",
                                            lineNumber: 85,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/thesis/app/(protected)/transaction/components/transactionModal.jsx",
                                    lineNumber: 83,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/thesis/app/(protected)/transaction/components/transactionModal.jsx",
                            lineNumber: 71,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end gap-3 pt-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onClose,
                                    className: "px-4 py-2 rounded-lg border text-slate-600 hover:bg-slate-100",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/thesis/app/(protected)/transaction/components/transactionModal.jsx",
                                    lineNumber: 97,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: "px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 shadow",
                                    children: "Save Transaction"
                                }, void 0, false, {
                                    fileName: "[project]/thesis/app/(protected)/transaction/components/transactionModal.jsx",
                                    lineNumber: 105,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/thesis/app/(protected)/transaction/components/transactionModal.jsx",
                            lineNumber: 96,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/thesis/app/(protected)/transaction/components/transactionModal.jsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/thesis/app/(protected)/transaction/components/transactionModal.jsx",
            lineNumber: 39,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/thesis/app/(protected)/transaction/components/transactionModal.jsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_s(TransactionModal, "NJUe1h01q+88VvUegRJF1ZLxnfg=");
_c = TransactionModal;
var _c;
__turbopack_context__.k.register(_c, "TransactionModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/thesis/app/(protected)/transaction/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TransactionsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/lib/supabaseClient.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '../dashboard/components/transactionTable'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$app$2f28$protected$292f$dashboard$2f$components$2f$useCashflowData$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/app/(protected)/dashboard/components/useCashflowData.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$app$2f28$protected$292f$transaction$2f$components$2f$transactionModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/app/(protected)/transaction/components/transactionModal.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function TransactionsPage() {
    _s();
    const { transactions: fetchedTransactions, loading, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$app$2f28$protected$292f$dashboard$2f$components$2f$useCashflowData$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCashflowData"])();
    const [transactions, setTransactions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showAddModal, setShowAddModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TransactionsPage.useEffect": ()=>{
            setTransactions(fetchedTransactions || []);
        }
    }["TransactionsPage.useEffect"], [
        fetchedTransactions
    ]);
    // -----------------------------
    // ADD TRANSACTION
    // -----------------------------
    const handleAddTransaction = async (newTransaction)=>{
        try {
            const lastBalance = transactions.length ? transactions[transactions.length - 1].balance : 0;
            const newBalance = lastBalance + (newTransaction.deposit || 0) - (newTransaction.withdrawal || 0);
            const transactionToInsert = {
                ...newTransaction,
                balance: newBalance
            };
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("transactions").insert([
                transactionToInsert
            ]).select();
            if (error) throw error;
            setTransactions((prev)=>[
                    ...prev,
                    data[0]
                ]);
            refetch();
        } catch (err) {
            console.error("Add transaction failed:", err.message);
            alert("Error adding transaction.");
        }
    };
    // -----------------------------
    // DELETE TRANSACTION
    // -----------------------------
    const handleDeleteTransaction = async (id)=>{
        if (!id) return;
        const confirmDelete = window.confirm("Delete this transaction?");
        if (!confirmDelete) return;
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("transactions").delete().eq("id", id);
            const updated = transactions.filter((t)=>t.id !== id);
            let runningBalance = 0;
            const recalculated = updated.map((t)=>{
                runningBalance += (t.deposit || 0) - (t.withdrawal || 0);
                return {
                    ...t,
                    balance: runningBalance
                };
            });
            setTransactions(recalculated);
            refetch();
        } catch (err) {
            console.error("Delete failed:", err.message);
            alert("Error deleting transaction.");
        }
    };
    // -----------------------------
    // EDIT TRANSACTION
    // -----------------------------
    const handleEditTransaction = async (updatedTransaction, id)=>{
        try {
            const index = transactions.findIndex((t)=>t.id === id);
            if (index === -1) throw new Error("Not found");
            const prevBalance = index > 0 ? transactions[index - 1].balance : 0;
            const newBalance = prevBalance + (updatedTransaction.deposit || 0) - (updatedTransaction.withdrawal || 0);
            const transactionToUpdate = {
                ...updatedTransaction,
                balance: newBalance
            };
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("transactions").update(transactionToUpdate).eq("id", id);
            if (error) throw error;
            const updated = [
                ...transactions
            ];
            updated[index] = transactionToUpdate;
            // Recompute next balances
            let runBal = newBalance;
            for(let i = index + 1; i < updated.length; i++){
                const t = updated[i];
                runBal += (t.deposit || 0) - (t.withdrawal || 0);
                updated[i] = {
                    ...t,
                    balance: runBal
                };
                await __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("transactions").update({
                    balance: runBal
                }).eq("id", t.id);
            }
            setTransactions(updated);
            refetch();
        } catch (err) {
            console.error("Edit failed:", err.message);
            alert("Error updating transaction.");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col md:flex-row md:items-center md:justify-between mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-bold text-slate-900",
                                children: "Transactions"
                            }, void 0, false, {
                                fileName: "[project]/thesis/app/(protected)/transaction/page.jsx",
                                lineNumber: 131,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-slate-500",
                                children: "Manage barangay income & expense records."
                            }, void 0, false, {
                                fileName: "[project]/thesis/app/(protected)/transaction/page.jsx",
                                lineNumber: 132,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/thesis/app/(protected)/transaction/page.jsx",
                        lineNumber: 130,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 mt-4 md:mt-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowAddModal(true),
                                className: "px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium   hover:bg-emerald-700 transition shadow",
                                children: "➕ Add Transaction"
                            }, void 0, false, {
                                fileName: "[project]/thesis/app/(protected)/transaction/page.jsx",
                                lineNumber: 141,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>refetch(),
                                className: "px-4 py-2 rounded-lg bg-blue-600 text-white font-medium   hover:bg-blue-700 transition shadow",
                                children: "🔄 Refresh"
                            }, void 0, false, {
                                fileName: "[project]/thesis/app/(protected)/transaction/page.jsx",
                                lineNumber: 152,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>window.print(),
                                className: "px-4 py-2 rounded-lg bg-slate-700 text-white font-medium   hover:bg-slate-800 transition shadow",
                                children: "🖨️ Print"
                            }, void 0, false, {
                                fileName: "[project]/thesis/app/(protected)/transaction/page.jsx",
                                lineNumber: 161,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/thesis/app/(protected)/transaction/page.jsx",
                        lineNumber: 138,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/thesis/app/(protected)/transaction/page.jsx",
                lineNumber: 129,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-xl shadow p-6 border border-slate-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TransactionTable, {
                        transactions: transactions,
                        loading: loading,
                        setTransactions: setTransactions,
                        onAddTransaction: handleAddTransaction,
                        onDeleteTransaction: handleDeleteTransaction,
                        onEditTransaction: handleEditTransaction
                    }, void 0, false, {
                        fileName: "[project]/thesis/app/(protected)/transaction/page.jsx",
                        lineNumber: 175,
                        columnNumber: 7
                    }, this),
                    showAddModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$app$2f28$protected$292f$transaction$2f$components$2f$transactionModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        onClose: ()=>setShowAddModal(false),
                        onSubmit: handleAddTransaction
                    }, void 0, false, {
                        fileName: "[project]/thesis/app/(protected)/transaction/page.jsx",
                        lineNumber: 184,
                        columnNumber: 3
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/thesis/app/(protected)/transaction/page.jsx",
                lineNumber: 173,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/thesis/app/(protected)/transaction/page.jsx",
        lineNumber: 126,
        columnNumber: 3
    }, this);
}
_s(TransactionsPage, "9PMc3lwWIuLMtCRq/1y/NOm3trQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$app$2f28$protected$292f$dashboard$2f$components$2f$useCashflowData$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCashflowData"]
    ];
});
_c = TransactionsPage;
var _c;
__turbopack_context__.k.register(_c, "TransactionsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=thesis_app_%28protected%29_0c94d81a._.js.map