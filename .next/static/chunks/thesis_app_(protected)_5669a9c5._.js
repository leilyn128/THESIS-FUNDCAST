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
function useCashflowData(year) {
    _s();
    const [transactions, setTransactions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [chartData, setChartData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCashflowData.useEffect": ()=>{
            if (year) fetchCashflow();
        }
    }["useCashflowData.useEffect"], [
        year
    ]);
    const fetchCashflow = async ()=>{
        setLoading(true);
        const startDate = "".concat(year, "-01-01");
        const endDate = "".concat(year, "-12-31");
        // 1️⃣ Fetch transactions FOR SELECTED YEAR ONLY
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("transactions").select("*").gte("date", startDate).lte("date", endDate).order("date", {
            ascending: true
        });
        if (error) {
            console.error("❌ Supabase fetch error:", error.message);
            setLoading(false);
            return;
        }
        // 2️⃣ Clean numeric values
        const mapped = (data || []).filter((row)=>row.date).map((row)=>({
                ...row,
                deposit: Number(String(row.deposit || "0").replace(/[₱, ]/g, "")),
                withdrawal: Number(String(row.withdrawal || "0").replace(/[₱, ]/g, "")),
                balance: Number(String(row.balance || "0").replace(/[₱, ]/g, "")),
                // OPTIONAL: normalize categories (safe)
                incomeCategory: row.income_category || row.category || null,
                expenseCategory: row.expense_category || row.category || null
            }));
        setTransactions(mapped);
        // 3️⃣ Aggregate per month
        const grouped = {};
        mapped.forEach((t)=>{
            const d = new Date(t.date);
            const monthKey = d.toLocaleString("default", {
                month: "short",
                year: "numeric"
            });
            if (!grouped[monthKey]) {
                grouped[monthKey] = {
                    month: monthKey,
                    income: 0,
                    expense: 0,
                    balance: 0
                };
            }
            grouped[monthKey].income += t.deposit || 0;
            grouped[monthKey].expense += t.withdrawal || 0;
            // last balance of the month
            grouped[monthKey].balance = t.balance || grouped[monthKey].balance;
        });
        const monthlyArray = Object.values(grouped).sort((a, b)=>new Date(a.month) - new Date(b.month)).map((g)=>({
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
"[project]/thesis/app/(protected)/dashboard/components/expensePieChart.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categorizeExpense",
    ()=>categorizeExpense,
    "default",
    ()=>ExpensePieChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/recharts/es6/chart/PieChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/recharts/es6/polar/Pie.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/recharts/es6/component/Cell.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
"use client";
;
;
const expenseCOLORS = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#84cc16",
    "#22c55e",
    "#0ea5e9",
    "#6366f1",
    "#a855f7",
    "#ec4899",
    "#14b8a6"
];
function categorizeExpense() {
    let description = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    const t = description.toLowerCase();
    if (t.includes("hon.") || t.includes("honor") || t.includes("appointed") || t.includes("elected") || t.includes("tanod") || t.includes("bhw") || t.includes("chief")) return "PS (Personal Services)";
    if (t.includes("sk")) return "10% SK Fund";
    if (t.includes("fire") || t.includes("safety drill") || t.includes("disaster") || t.includes("rescue") || t.includes("drrm")) return "5% BDRRM Fund";
    if (t.includes("women") || t.includes("senior") || t.includes("pwd") || t.includes("nutrition") || t.includes("feeding") || t.includes("deworm") || t.includes("gap")) return "GAD Programs";
    if (t.includes("construction") || t.includes("improvement") || t.includes("materials") || t.includes("solar") || t.includes("equipment") || t.includes("road") || t.includes("building") || t.includes("water system") || t.includes("rehab")) return "20% BDF / Capital Outlay";
    if (t.includes("travel") || t.includes("seminar") || t.includes("training") || t.includes("supplies") || t.includes("office") || t.includes("water") || t.includes("electric") || t.includes("bond") || t.includes("security") || t.includes("bookkeeper") || t.includes("lumber") || t.includes("fuel") || t.includes("diesel") || t.includes("registration") || t.includes("check book") || t.includes("maintenance") || t.includes("interest") || t.includes("tax") || t.includes("pcf")) return "MOOE";
    return "Other / Non-Office";
}
function ExpensePieChart(param) {
    let { transactions } = param;
    const expenseTx = transactions.filter((t)=>t.withdrawal > 0);
    // =========================
    // GROUP EXPENSES
    // =========================
    const grouped = {};
    expenseTx.forEach((t)=>{
        const category = categorizeExpense(t.description || "");
        grouped[category] = (grouped[category] || 0) + Number(t.withdrawal);
    });
    // =========================
    // BUILD STABLE CHART DATA
    // =========================
    const chartData = Object.entries(grouped).map((param)=>{
        let [name, value] = param;
        return {
            name,
            value
        };
    });
    // =========================
    // STABLE COLOR MAP (KEY FIX)
    // =========================
    const colorMap = {};
    chartData.forEach((item, index)=>{
        colorMap[item.name] = expenseCOLORS[index % expenseCOLORS.length];
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full flex flex-col items-center gap-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-[260px]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                    width: "100%",
                    aspect: 1,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PieChart"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Pie"], {
                                data: chartData,
                                cx: "50%",
                                cy: "50%",
                                outerRadius: "80%",
                                dataKey: "value",
                                label: false,
                                labelLine: false,
                                children: chartData.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cell"], {
                                        fill: colorMap[item.name]
                                    }, item.name, false, {
                                        fileName: "[project]/thesis/app/(protected)/dashboard/components/expensePieChart.jsx",
                                        lineNumber: 131,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/thesis/app/(protected)/dashboard/components/expensePieChart.jsx",
                                lineNumber: 121,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {}, void 0, false, {
                                fileName: "[project]/thesis/app/(protected)/dashboard/components/expensePieChart.jsx",
                                lineNumber: 138,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/thesis/app/(protected)/dashboard/components/expensePieChart.jsx",
                        lineNumber: 120,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/thesis/app/(protected)/dashboard/components/expensePieChart.jsx",
                    lineNumber: 119,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/thesis/app/(protected)/dashboard/components/expensePieChart.jsx",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 w-full max-w-xs space-y-2 flex flex-col items-start text-left",
                children: chartData.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 text-m",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-3 h-3 rounded-sm",
                                style: {
                                    backgroundColor: colorMap[item.name]
                                }
                            }, void 0, false, {
                                fileName: "[project]/thesis/app/(protected)/dashboard/components/expensePieChart.jsx",
                                lineNumber: 150,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-700",
                                children: item.name
                            }, void 0, false, {
                                fileName: "[project]/thesis/app/(protected)/dashboard/components/expensePieChart.jsx",
                                lineNumber: 154,
                                columnNumber: 7
                            }, this)
                        ]
                    }, item.name, true, {
                        fileName: "[project]/thesis/app/(protected)/dashboard/components/expensePieChart.jsx",
                        lineNumber: 146,
                        columnNumber: 5
                    }, this))
            }, void 0, false, {
                fileName: "[project]/thesis/app/(protected)/dashboard/components/expensePieChart.jsx",
                lineNumber: 144,
                columnNumber: 1
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/thesis/app/(protected)/dashboard/components/expensePieChart.jsx",
        lineNumber: 116,
        columnNumber: 1
    }, this);
}
_c = ExpensePieChart;
var _c;
__turbopack_context__.k.register(_c, "ExpensePieChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/thesis/app/(protected)/expenses/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ExpensesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/recharts/es6/chart/BarChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/recharts/es6/cartesian/Bar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/recharts/es6/cartesian/XAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/recharts/es6/cartesian/YAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/recharts/es6/component/Legend.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/lib/supabaseClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$app$2f28$protected$292f$dashboard$2f$components$2f$useCashflowData$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/app/(protected)/dashboard/components/useCashflowData.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$app$2f28$protected$292f$dashboard$2f$components$2f$expensePieChart$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/app/(protected)/dashboard/components/expensePieChart.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
/* =========================
   HELPERS
========================= */ function normalizeCategory() {
    let cat = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    const t = cat.toLowerCase();
    if (t.includes("personal")) return "Personal Services";
    if (t.includes("mooe")) return "MOOE";
    if (t.includes("20")) return "20% BDF";
    if (t.includes("bdf")) return "20% BDF";
    if (t.includes("gadr") || t.includes("gad")) return "15% GAD";
    if (t.includes("bdr")) return "5% BDRRMF";
    if (t.includes("sk")) return "10% SK Fund";
    if (t.includes("senior")) return "1% Senior & PWD";
    return null; // ❗ VERY IMPORTANT
}
function ExpensesPage() {
    _s();
    /* =========================
     YEAR
  ========================= */ const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const START_YEAR = 2025;
    const currentYear = new Date().getFullYear();
    const yearFromUrl = Number(searchParams.get("year"));
    const selectedYear = yearFromUrl && yearFromUrl >= START_YEAR ? yearFromUrl : currentYear;
    /* =========================
     TRANSACTIONS
  ========================= */ const { transactions: fetchedTransactions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$app$2f28$protected$292f$dashboard$2f$components$2f$useCashflowData$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCashflowData"])(selectedYear);
    const [transactions, setTransactions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ExpensesPage.useEffect": ()=>{
            setTransactions(fetchedTransactions || []);
        }
    }["ExpensesPage.useEffect"], [
        fetchedTransactions
    ]);
    /* =========================
     ALLOCATION TOTALS
  ========================= */ const [allocations, setAllocations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ExpensesPage.useEffect": ()=>{
            async function fetchAllocations() {
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("budget_uploads").select("id, category, amount, description").eq("year", selectedYear);
                if (error) {
                    console.error("Allocation fetch error:", error);
                    return;
                }
                const totals = (data || []).filter({
                    "ExpensesPage.useEffect.fetchAllocations.totals": (row)=>{
                        var _row_description;
                        return ((_row_description = row.description) === null || _row_description === void 0 ? void 0 : _row_description.trim().toLowerCase()) === "total";
                    }
                }["ExpensesPage.useEffect.fetchAllocations.totals"]);
                setAllocations(totals.map({
                    "ExpensesPage.useEffect.fetchAllocations": (row)=>({
                            id: row.id,
                            category: normalizeCategory(row.category),
                            allocated: Number(row.amount)
                        })
                }["ExpensesPage.useEffect.fetchAllocations"]));
            }
            fetchAllocations();
        }
    }["ExpensesPage.useEffect"], [
        selectedYear
    ]);
    /* =========================
     BREAKDOWN STATE
  ========================= */ const [expandedCategory, setExpandedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [subcategories, setSubcategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    async function fetchSubcategories(category) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("budget_uploads").select("id, description, amount").eq("year", selectedYear).eq("category", category).neq("description", "Total");
        if (error) {
            console.error("Subcategory fetch error:", error);
            return;
        }
        setSubcategories((prev)=>({
                ...prev,
                [category]: data || []
            }));
    }
    function toggleCategory(category) {
        setExpandedCategory((prev)=>{
            const next = prev === category ? null : category;
            if (next && !subcategories[category]) {
                fetchSubcategories(category);
            }
            return next;
        });
    }
    /* =========================
     CHART DATA (SOURCE = ALLOCATIONS)
  ========================= */ const chartData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ExpensesPage.useMemo[chartData]": ()=>{
            const map = {};
            // 1️⃣ Allocations = source of truth
            allocations.forEach({
                "ExpensesPage.useMemo[chartData]": (a)=>{
                    map[a.category] = {
                        category: a.category,
                        allocated: a.allocated,
                        spent: 0
                    };
                }
            }["ExpensesPage.useMemo[chartData]"]);
            // 2️⃣ Apply expenses using SAME vocabulary
            transactions.forEach({
                "ExpensesPage.useMemo[chartData]": (t)=>{
                    if (!t.withdrawal || t.withdrawal <= 0) return;
                    const raw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$app$2f28$protected$292f$dashboard$2f$components$2f$expensePieChart$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categorizeExpense"])(t.description || "");
                    const category = normalizeCategory(raw);
                    if (!category) return;
                    if (!map[category]) return;
                    map[category].spent += Number(t.withdrawal);
                }
            }["ExpensesPage.useMemo[chartData]"]);
            return Object.values(map).sort({
                "ExpensesPage.useMemo[chartData]": (a, b)=>b.allocated - a.allocated
            }["ExpensesPage.useMemo[chartData]"]);
        }
    }["ExpensesPage.useMemo[chartData]"], [
        allocations,
        transactions
    ]);
    /* =========================
     UI
  ========================= */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl bg-emerald-700 px-6 py-4 text-white shadow",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-xl font-semibold",
                        children: [
                            "💸 Expenses vs Budget Allocation (",
                            selectedYear,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs opacity-90 mt-0.5",
                        children: "Official budget allocation with detailed breakdown"
                    }, void 0, false, {
                        fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white p-5 rounded-xl border shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-semibold text-base mb-4",
                        children: "📊 Budget Allocation"
                    }, void 0, false, {
                        fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                        lineNumber: 186,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                        children: allocations.map((a)=>{
                            var _subcategories_a_category;
                            const isOpen = expandedCategory === a.category;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-lg border transition\n                  ".concat(isOpen ? "border-emerald-400" : "border-gray-200", "\n                "),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-4 py-3 flex justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[18px] uppercase",
                                                        children: a.category || "Uncategorized"
                                                    }, void 0, false, {
                                                        fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                                                        lineNumber: 203,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xl font-semibold text-emerald-600",
                                                        children: [
                                                            "₱",
                                                            a.allocated.toLocaleString()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                                                        lineNumber: 207,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                                                lineNumber: 202,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "text-[11px] text-emerald-600",
                                                onClick: ()=>toggleCategory(a.category),
                                                children: isOpen ? "Hide" : "Details"
                                            }, void 0, false, {
                                                fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                                                lineNumber: 212,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                                        lineNumber: 201,
                                        columnNumber: 17
                                    }, this),
                                    isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border-t px-4 py-2 bg-gray-50 text-xs space-y-1 max-h-56 overflow-y-auto",
                                        children: ((_subcategories_a_category = subcategories[a.category]) === null || _subcategories_a_category === void 0 ? void 0 : _subcategories_a_category.length) ? subcategories[a.category].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "truncate max-w-[70%]",
                                                        children: s.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                                                        lineNumber: 229,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium",
                                                        children: [
                                                            "₱",
                                                            Number(s.amount).toLocaleString()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                                                        lineNumber: 232,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, s.id, true, {
                                                fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                                                lineNumber: 225,
                                                columnNumber: 25
                                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "italic text-gray-400",
                                            children: "No breakdown available"
                                        }, void 0, false, {
                                            fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                                            lineNumber: 238,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                                        lineNumber: 222,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, a.id, true, {
                                fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                                lineNumber: 195,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                        lineNumber: 190,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                lineNumber: 185,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white p-6 rounded-xl border shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-semibold text-lg mb-4",
                        children: "📈 Allocation vs Expenses"
                    }, void 0, false, {
                        fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                        lineNumber: 252,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                        width: "100%",
                        height: 320,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"], {
                            data: chartData,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                    dataKey: "category"
                                }, void 0, false, {
                                    fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                                    lineNumber: 258,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {}, void 0, false, {
                                    fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                                    lineNumber: 259,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                    formatter: (v)=>"₱".concat(v.toLocaleString())
                                }, void 0, false, {
                                    fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                                    lineNumber: 260,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Legend"], {}, void 0, false, {
                                    fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                                    lineNumber: 261,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                                    dataKey: "allocated",
                                    fill: "#10b981"
                                }, void 0, false, {
                                    fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                                    lineNumber: 262,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                                    dataKey: "spent",
                                    fill: "#ef4444"
                                }, void 0, false, {
                                    fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                                    lineNumber: 263,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                            lineNumber: 257,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                        lineNumber: 256,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
                lineNumber: 251,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/thesis/app/(protected)/expenses/page.jsx",
        lineNumber: 173,
        columnNumber: 5
    }, this);
}
_s(ExpensesPage, "58eGo6bWemlh5rnnlOuce3/3dFM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$app$2f28$protected$292f$dashboard$2f$components$2f$useCashflowData$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCashflowData"]
    ];
});
_c = ExpensesPage;
var _c;
__turbopack_context__.k.register(_c, "ExpensesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=thesis_app_%28protected%29_5669a9c5._.js.map