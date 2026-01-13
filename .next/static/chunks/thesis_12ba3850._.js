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
"[project]/thesis/app/(protected)/expenses/page.jsx [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/thesis/app/(protected)/expenses/page.jsx'\n\nExpected '}', got '<eof>'");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[project]/thesis/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clsx",
    ()=>clsx,
    "default",
    ()=>__TURBOPACK__default__export__
]);
function r(e) {
    var t, f, n = "";
    if ("string" == typeof e || "number" == typeof e) n += e;
    else if ("object" == typeof e) if (Array.isArray(e)) {
        var o = e.length;
        for(t = 0; t < o; t++)e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
    } else for(f in e)e[f] && (n && (n += " "), n += f);
    return n;
}
function clsx() {
    for(var e, t, f = 0, n = "", o = arguments.length; f < o; f++)(e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
    return n;
}
const __TURBOPACK__default__export__ = clsx;
}),
"[project]/thesis/node_modules/es-toolkit/dist/function/debounce.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
function debounce(func, debounceMs) {
    let { signal, edges } = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    let pendingThis = undefined;
    let pendingArgs = null;
    const leading = edges != null && edges.includes('leading');
    const trailing = edges == null || edges.includes('trailing');
    const invoke = ()=>{
        if (pendingArgs !== null) {
            func.apply(pendingThis, pendingArgs);
            pendingThis = undefined;
            pendingArgs = null;
        }
    };
    const onTimerEnd = ()=>{
        if (trailing) {
            invoke();
        }
        cancel();
    };
    let timeoutId = null;
    const schedule = ()=>{
        if (timeoutId != null) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(()=>{
            timeoutId = null;
            onTimerEnd();
        }, debounceMs);
    };
    const cancelTimer = ()=>{
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };
    const cancel = ()=>{
        cancelTimer();
        pendingThis = undefined;
        pendingArgs = null;
    };
    const flush = ()=>{
        invoke();
    };
    const debounced = function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
            return;
        }
        pendingThis = this;
        pendingArgs = args;
        const isFirstCall = timeoutId == null;
        schedule();
        if (leading && isFirstCall) {
            invoke();
        }
    };
    debounced.schedule = schedule;
    debounced.cancel = cancel;
    debounced.flush = flush;
    signal === null || signal === void 0 ? void 0 : signal.addEventListener('abort', cancel, {
        once: true
    });
    return debounced;
}
exports.debounce = debounce;
}),
"[project]/thesis/node_modules/es-toolkit/dist/compat/function/debounce.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const debounce$1 = __turbopack_context__.r("[project]/thesis/node_modules/es-toolkit/dist/function/debounce.js [app-client] (ecmascript)");
function debounce(func) {
    let debounceMs = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    if (typeof options !== 'object') {
        options = {};
    }
    const { leading = false, trailing = true, maxWait } = options;
    const edges = Array(2);
    if (leading) {
        edges[0] = 'leading';
    }
    if (trailing) {
        edges[1] = 'trailing';
    }
    let result = undefined;
    let pendingAt = null;
    const _debounced = debounce$1.debounce(function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        result = func.apply(this, args);
        pendingAt = null;
    }, debounceMs, {
        edges
    });
    const debounced = function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        if (maxWait != null) {
            if (pendingAt === null) {
                pendingAt = Date.now();
            }
            if (Date.now() - pendingAt >= maxWait) {
                result = func.apply(this, args);
                pendingAt = Date.now();
                _debounced.cancel();
                _debounced.schedule();
                return result;
            }
        }
        _debounced.apply(this, args);
        return result;
    };
    const flush = ()=>{
        _debounced.flush();
        return result;
    };
    debounced.cancel = _debounced.cancel;
    debounced.flush = flush;
    return debounced;
}
exports.debounce = debounce;
}),
"[project]/thesis/node_modules/es-toolkit/dist/compat/function/throttle.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const debounce = __turbopack_context__.r("[project]/thesis/node_modules/es-toolkit/dist/compat/function/debounce.js [app-client] (ecmascript)");
function throttle(func) {
    let throttleMs = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const { leading = true, trailing = true } = options;
    return debounce.debounce(func, throttleMs, {
        leading,
        maxWait: throttleMs,
        trailing
    });
}
exports.throttle = throttle;
}),
"[project]/thesis/node_modules/es-toolkit/compat/throttle.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/thesis/node_modules/es-toolkit/dist/compat/function/throttle.js [app-client] (ecmascript)").throttle;
}),
"[project]/thesis/node_modules/es-toolkit/dist/_internal/isUnsafeProperty.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
function isUnsafeProperty(key) {
    return key === '__proto__';
}
exports.isUnsafeProperty = isUnsafeProperty;
}),
"[project]/thesis/node_modules/es-toolkit/dist/compat/_internal/isDeepKey.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
function isDeepKey(key) {
    switch(typeof key){
        case 'number':
        case 'symbol':
            {
                return false;
            }
        case 'string':
            {
                return key.includes('.') || key.includes('[') || key.includes(']');
            }
    }
}
exports.isDeepKey = isDeepKey;
}),
"[project]/thesis/node_modules/es-toolkit/dist/compat/_internal/toKey.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
function toKey(value) {
    var _value_valueOf;
    if (typeof value === 'string' || typeof value === 'symbol') {
        return value;
    }
    if (Object.is(value === null || value === void 0 ? void 0 : (_value_valueOf = value.valueOf) === null || _value_valueOf === void 0 ? void 0 : _value_valueOf.call(value), -0)) {
        return '-0';
    }
    return String(value);
}
exports.toKey = toKey;
}),
"[project]/thesis/node_modules/es-toolkit/dist/compat/util/toString.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
function toString(value) {
    if (value == null) {
        return '';
    }
    if (typeof value === 'string') {
        return value;
    }
    if (Array.isArray(value)) {
        return value.map(toString).join(',');
    }
    const result = String(value);
    if (result === '0' && Object.is(Number(value), -0)) {
        return '-0';
    }
    return result;
}
exports.toString = toString;
}),
"[project]/thesis/node_modules/es-toolkit/dist/compat/util/toPath.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const toString = __turbopack_context__.r("[project]/thesis/node_modules/es-toolkit/dist/compat/util/toString.js [app-client] (ecmascript)");
const toKey = __turbopack_context__.r("[project]/thesis/node_modules/es-toolkit/dist/compat/_internal/toKey.js [app-client] (ecmascript)");
function toPath(deepKey) {
    if (Array.isArray(deepKey)) {
        return deepKey.map(toKey.toKey);
    }
    if (typeof deepKey === 'symbol') {
        return [
            deepKey
        ];
    }
    deepKey = toString.toString(deepKey);
    const result = [];
    const length = deepKey.length;
    if (length === 0) {
        return result;
    }
    let index = 0;
    let key = '';
    let quoteChar = '';
    let bracket = false;
    if (deepKey.charCodeAt(0) === 46) {
        result.push('');
        index++;
    }
    while(index < length){
        const char = deepKey[index];
        if (quoteChar) {
            if (char === '\\' && index + 1 < length) {
                index++;
                key += deepKey[index];
            } else if (char === quoteChar) {
                quoteChar = '';
            } else {
                key += char;
            }
        } else if (bracket) {
            if (char === '"' || char === "'") {
                quoteChar = char;
            } else if (char === ']') {
                bracket = false;
                result.push(key);
                key = '';
            } else {
                key += char;
            }
        } else {
            if (char === '[') {
                bracket = true;
                if (key) {
                    result.push(key);
                    key = '';
                }
            } else if (char === '.') {
                if (key) {
                    result.push(key);
                    key = '';
                }
            } else {
                key += char;
            }
        }
        index++;
    }
    if (key) {
        result.push(key);
    }
    return result;
}
exports.toPath = toPath;
}),
"[project]/thesis/node_modules/es-toolkit/dist/compat/object/get.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const isUnsafeProperty = __turbopack_context__.r("[project]/thesis/node_modules/es-toolkit/dist/_internal/isUnsafeProperty.js [app-client] (ecmascript)");
const isDeepKey = __turbopack_context__.r("[project]/thesis/node_modules/es-toolkit/dist/compat/_internal/isDeepKey.js [app-client] (ecmascript)");
const toKey = __turbopack_context__.r("[project]/thesis/node_modules/es-toolkit/dist/compat/_internal/toKey.js [app-client] (ecmascript)");
const toPath = __turbopack_context__.r("[project]/thesis/node_modules/es-toolkit/dist/compat/util/toPath.js [app-client] (ecmascript)");
function get(object, path, defaultValue) {
    if (object == null) {
        return defaultValue;
    }
    switch(typeof path){
        case 'string':
            {
                if (isUnsafeProperty.isUnsafeProperty(path)) {
                    return defaultValue;
                }
                const result = object[path];
                if (result === undefined) {
                    if (isDeepKey.isDeepKey(path)) {
                        return get(object, toPath.toPath(path), defaultValue);
                    } else {
                        return defaultValue;
                    }
                }
                return result;
            }
        case 'number':
        case 'symbol':
            {
                if (typeof path === 'number') {
                    path = toKey.toKey(path);
                }
                const result = object[path];
                if (result === undefined) {
                    return defaultValue;
                }
                return result;
            }
        default:
            {
                if (Array.isArray(path)) {
                    return getWithPath(object, path, defaultValue);
                }
                if (Object.is(path === null || path === void 0 ? void 0 : path.valueOf(), -0)) {
                    path = '-0';
                } else {
                    path = String(path);
                }
                if (isUnsafeProperty.isUnsafeProperty(path)) {
                    return defaultValue;
                }
                const result = object[path];
                if (result === undefined) {
                    return defaultValue;
                }
                return result;
            }
    }
}
function getWithPath(object, path, defaultValue) {
    if (path.length === 0) {
        return defaultValue;
    }
    let current = object;
    for(let index = 0; index < path.length; index++){
        if (current == null) {
            return defaultValue;
        }
        if (isUnsafeProperty.isUnsafeProperty(path[index])) {
            return defaultValue;
        }
        current = current[path[index]];
    }
    if (current === undefined) {
        return defaultValue;
    }
    return current;
}
exports.get = get;
}),
"[project]/thesis/node_modules/es-toolkit/compat/get.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/thesis/node_modules/es-toolkit/dist/compat/object/get.js [app-client] (ecmascript)").get;
}),
"[project]/thesis/node_modules/recharts/es6/util/DataUtils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "findEntryInArray",
    ()=>findEntryInArray,
    "getLinearRegression",
    ()=>getLinearRegression,
    "getPercentValue",
    ()=>getPercentValue,
    "hasDuplicate",
    ()=>hasDuplicate,
    "interpolate",
    ()=>interpolate,
    "isNan",
    ()=>isNan,
    "isNotNil",
    ()=>isNotNil,
    "isNullish",
    ()=>isNullish,
    "isNumOrStr",
    ()=>isNumOrStr,
    "isNumber",
    ()=>isNumber,
    "isPercent",
    ()=>isPercent,
    "mathSign",
    ()=>mathSign,
    "noop",
    ()=>noop,
    "uniqueId",
    ()=>uniqueId,
    "upperFirst",
    ()=>upperFirst
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$es$2d$toolkit$2f$compat$2f$get$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/es-toolkit/compat/get.js [app-client] (ecmascript)");
;
var mathSign = (value)=>{
    if (value === 0) {
        return 0;
    }
    if (value > 0) {
        return 1;
    }
    return -1;
};
var isNan = (value)=>{
    // eslint-disable-next-line eqeqeq
    return typeof value == 'number' && value != +value;
};
var isPercent = (value)=>typeof value === 'string' && value.indexOf('%') === value.length - 1;
var isNumber = (value)=>(typeof value === 'number' || value instanceof Number) && !isNan(value);
var isNumOrStr = (value)=>isNumber(value) || typeof value === 'string';
var idCounter = 0;
var uniqueId = (prefix)=>{
    var id = ++idCounter;
    return "".concat(prefix || '').concat(id);
};
var getPercentValue = function getPercentValue(percent, totalValue) {
    var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var validate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    if (!isNumber(percent) && typeof percent !== 'string') {
        return defaultValue;
    }
    var value;
    if (isPercent(percent)) {
        if (totalValue == null) {
            return defaultValue;
        }
        var index = percent.indexOf('%');
        value = totalValue * parseFloat(percent.slice(0, index)) / 100;
    } else {
        value = +percent;
    }
    if (isNan(value)) {
        value = defaultValue;
    }
    if (validate && totalValue != null && value > totalValue) {
        value = totalValue;
    }
    return value;
};
var hasDuplicate = (ary)=>{
    if (!Array.isArray(ary)) {
        return false;
    }
    var len = ary.length;
    var cache = {};
    for(var i = 0; i < len; i++){
        if (!cache[ary[i]]) {
            cache[ary[i]] = true;
        } else {
            return true;
        }
    }
    return false;
};
function interpolate(start, end, t) {
    if (isNumber(start) && isNumber(end)) {
        return start + t * (end - start);
    }
    return end;
}
function findEntryInArray(ary, specifiedKey, specifiedValue) {
    if (!ary || !ary.length) {
        return undefined;
    }
    return ary.find((entry)=>entry && (typeof specifiedKey === 'function' ? specifiedKey(entry) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$es$2d$toolkit$2f$compat$2f$get$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(entry, specifiedKey)) === specifiedValue);
}
var getLinearRegression = (data)=>{
    var len = data.length;
    var xsum = 0;
    var ysum = 0;
    var xysum = 0;
    var xxsum = 0;
    var xmin = Infinity;
    var xmax = -Infinity;
    var xcurrent = 0;
    var ycurrent = 0;
    for(var i = 0; i < len; i++){
        xcurrent = data[i].cx || 0;
        ycurrent = data[i].cy || 0;
        xsum += xcurrent;
        ysum += ycurrent;
        xysum += xcurrent * ycurrent;
        xxsum += xcurrent * xcurrent;
        xmin = Math.min(xmin, xcurrent);
        xmax = Math.max(xmax, xcurrent);
    }
    var a = len * xxsum !== xsum * xsum ? (len * xysum - xsum * ysum) / (len * xxsum - xsum * xsum) : 0;
    return {
        xmin,
        xmax,
        a,
        b: (ysum - a * xsum) / len
    };
};
var isNullish = (value)=>{
    return value === null || typeof value === 'undefined';
};
var upperFirst = (value)=>{
    if (isNullish(value)) {
        return value;
    }
    return "".concat(value.charAt(0).toUpperCase()).concat(value.slice(1));
};
function isNotNil(value) {
    return value != null;
}
function noop() {}
}),
"[project]/thesis/node_modules/recharts/es6/util/LogUtils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* eslint no-console: 0 */ __turbopack_context__.s([
    "warn",
    ()=>warn
]);
var isDev = true;
var warn = function warn(condition, format) {
    for(var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        args[_key - 2] = arguments[_key];
    }
    if (isDev && typeof console !== 'undefined' && console.warn) {
        if (format === undefined) {
            console.warn('LogUtils requires an error message argument');
        }
        if (!condition) {
            if (format === undefined) {
                console.warn('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
            } else {
                var argIndex = 0;
                console.warn(format.replace(/%s/g, ()=>args[argIndex++]));
            }
        }
    }
};
}),
"[project]/thesis/node_modules/recharts/es6/component/responsiveContainerUtils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateChartDimensions",
    ()=>calculateChartDimensions,
    "getDefaultWidthAndHeight",
    ()=>getDefaultWidthAndHeight,
    "getInnerDivStyle",
    ()=>getInnerDivStyle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/recharts/es6/util/DataUtils.js [app-client] (ecmascript)");
;
var calculateChartDimensions = (containerWidth, containerHeight, props)=>{
    var { width = '100%', height = '100%', aspect, maxHeight } = props;
    /*
   * The containerWidth and containerHeight are already percentage based because it's set as that percentage in CSS.
   * Means we don't have to calculate percentages here.
   */ var calculatedWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPercent"])(width) ? containerWidth : Number(width);
    var calculatedHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPercent"])(height) ? containerHeight : Number(height);
    if (aspect && aspect > 0) {
        // Preserve the desired aspect ratio
        if (calculatedWidth) {
            // Will default to using width for aspect ratio
            calculatedHeight = calculatedWidth / aspect;
        } else if (calculatedHeight) {
            // But we should also take height into consideration
            calculatedWidth = calculatedHeight * aspect;
        }
        // if maxHeight is set, overwrite if calculatedHeight is greater than maxHeight
        if (maxHeight && calculatedHeight != null && calculatedHeight > maxHeight) {
            calculatedHeight = maxHeight;
        }
    }
    return {
        calculatedWidth,
        calculatedHeight
    };
};
var bothOverflow = {
    width: 0,
    height: 0,
    overflow: 'visible'
};
var overflowX = {
    width: 0,
    overflowX: 'visible'
};
var overflowY = {
    height: 0,
    overflowY: 'visible'
};
var noStyle = {};
var getInnerDivStyle = (props)=>{
    var { width, height } = props;
    var isWidthPercent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPercent"])(width);
    var isHeightPercent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPercent"])(height);
    if (isWidthPercent && isHeightPercent) {
        return bothOverflow;
    }
    if (isWidthPercent) {
        return overflowX;
    }
    if (isHeightPercent) {
        return overflowY;
    }
    return noStyle;
};
function getDefaultWidthAndHeight(_ref) {
    var { width, height, aspect } = _ref;
    var calculatedWidth = width;
    var calculatedHeight = height;
    if (calculatedWidth === undefined && calculatedHeight === undefined) {
        calculatedWidth = '100%';
        calculatedHeight = '100%';
    } else if (calculatedWidth === undefined) {
        calculatedWidth = aspect && aspect > 0 ? undefined : '100%';
    } else if (calculatedHeight === undefined) {
        calculatedHeight = aspect && aspect > 0 ? undefined : '100%';
    }
    return {
        width: calculatedWidth,
        height: calculatedHeight
    };
}
}),
"[project]/thesis/node_modules/recharts/es6/util/isWellBehavedNumber.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isPositiveNumber",
    ()=>isPositiveNumber,
    "isWellBehavedNumber",
    ()=>isWellBehavedNumber
]);
function isWellBehavedNumber(n) {
    return Number.isFinite(n);
}
function isPositiveNumber(n) {
    return typeof n === 'number' && n > 0 && Number.isFinite(n);
}
}),
"[project]/thesis/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ResponsiveContainer",
    ()=>ResponsiveContainer,
    "useResponsiveContainerContext",
    ()=>useResponsiveContainerContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$es$2d$toolkit$2f$compat$2f$throttle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/es-toolkit/compat/throttle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/recharts/es6/util/DataUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$LogUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/recharts/es6/util/LogUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$responsiveContainerUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/recharts/es6/component/responsiveContainerUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$isWellBehavedNumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/thesis/node_modules/recharts/es6/util/isWellBehavedNumber.js [app-client] (ecmascript)");
function _extends() {
    return _extends = ("TURBOPACK compile-time truthy", 1) ? Object.assign.bind() : "TURBOPACK unreachable", _extends.apply(null, arguments);
}
function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r) {
            return Object.getOwnPropertyDescriptor(e, r).enumerable;
        })), t.push.apply(t, o);
    }
    return t;
}
function _objectSpread(e) {
    for(var r = 1; r < arguments.length; r++){
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
            _defineProperty(e, r, t[r]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
        });
    }
    return e;
}
function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[r] = t, e;
}
function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
}
;
;
;
;
;
;
;
;
var ResponsiveContainerContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    width: -1,
    height: -1
});
function isAcceptableSize(size) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$isWellBehavedNumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPositiveNumber"])(size.width) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$isWellBehavedNumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPositiveNumber"])(size.height);
}
function ResponsiveContainerContextProvider(_ref) {
    var { children, width, height } = _ref;
    var size = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ResponsiveContainerContextProvider.useMemo[size]": ()=>({
                width,
                height
            })
    }["ResponsiveContainerContextProvider.useMemo[size]"], [
        width,
        height
    ]);
    if (!isAcceptableSize(size)) {
        /*
     * Don't render the container if width or height is non-positive because
     * in that case the chart will not be rendered properly anyway.
     * We will instead wait for the next resize event to provide the correct dimensions.
     */ return null;
    }
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](ResponsiveContainerContext.Provider, {
        value: size
    }, children);
}
var useResponsiveContainerContext = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ResponsiveContainerContext);
var SizeDetectorContainer = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((_ref2, ref)=>{
    var { aspect, initialDimension = {
        width: -1,
        height: -1
    }, width, height, /*
     * default min-width to 0 if not specified - 'auto' causes issues with flexbox
     * https://github.com/recharts/recharts/issues/172
     */ minWidth = 0, minHeight, maxHeight, children, debounce = 0, id, className, onResize, style = {} } = _ref2;
    var containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    /*
   * We are using a ref to avoid re-creating the ResizeObserver when the onResize function changes.
   * The ref is updated on every render, so the latest onResize function is always available in the effect.
   */ var onResizeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    onResizeRef.current = onResize;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImperativeHandle"])(ref, {
        "SizeDetectorContainer.useImperativeHandle": ()=>containerRef.current
    }["SizeDetectorContainer.useImperativeHandle"]);
    var [sizes, setSizes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        containerWidth: initialDimension.width,
        containerHeight: initialDimension.height
    });
    var setContainerSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SizeDetectorContainer.useCallback[setContainerSize]": (newWidth, newHeight)=>{
            setSizes({
                "SizeDetectorContainer.useCallback[setContainerSize]": (prevState)=>{
                    var roundedWidth = Math.round(newWidth);
                    var roundedHeight = Math.round(newHeight);
                    if (prevState.containerWidth === roundedWidth && prevState.containerHeight === roundedHeight) {
                        return prevState;
                    }
                    return {
                        containerWidth: roundedWidth,
                        containerHeight: roundedHeight
                    };
                }
            }["SizeDetectorContainer.useCallback[setContainerSize]"]);
        }
    }["SizeDetectorContainer.useCallback[setContainerSize]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SizeDetectorContainer.useEffect": ()=>{
            if (containerRef.current == null || typeof ResizeObserver === 'undefined') {
                return __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"];
            }
            var callback = {
                "SizeDetectorContainer.useEffect.callback": (entries)=>{
                    var _onResizeRef$current;
                    var { width: containerWidth, height: containerHeight } = entries[0].contentRect;
                    setContainerSize(containerWidth, containerHeight);
                    (_onResizeRef$current = onResizeRef.current) === null || _onResizeRef$current === void 0 || _onResizeRef$current.call(onResizeRef, containerWidth, containerHeight);
                }
            }["SizeDetectorContainer.useEffect.callback"];
            if (debounce > 0) {
                callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$es$2d$toolkit$2f$compat$2f$throttle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(callback, debounce, {
                    trailing: true,
                    leading: false
                });
            }
            var observer = new ResizeObserver(callback);
            var { width: containerWidth, height: containerHeight } = containerRef.current.getBoundingClientRect();
            setContainerSize(containerWidth, containerHeight);
            observer.observe(containerRef.current);
            return ({
                "SizeDetectorContainer.useEffect": ()=>{
                    observer.disconnect();
                }
            })["SizeDetectorContainer.useEffect"];
        }
    }["SizeDetectorContainer.useEffect"], [
        setContainerSize,
        debounce
    ]);
    var { containerWidth, containerHeight } = sizes;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$LogUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warn"])(!aspect || aspect > 0, 'The aspect(%s) must be greater than zero.', aspect);
    var { calculatedWidth, calculatedHeight } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$responsiveContainerUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateChartDimensions"])(containerWidth, containerHeight, {
        width,
        height,
        aspect,
        maxHeight
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$LogUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warn"])(calculatedWidth != null && calculatedWidth > 0 || calculatedHeight != null && calculatedHeight > 0, "The width(%s) and height(%s) of chart should be greater than 0,\n       please check the style of container, or the props width(%s) and height(%s),\n       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the\n       height and width.", calculatedWidth, calculatedHeight, width, height, minWidth, minHeight, aspect);
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("div", {
        id: id ? "".concat(id) : undefined,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])('recharts-responsive-container', className),
        style: _objectSpread(_objectSpread({}, style), {}, {
            width,
            height,
            minWidth,
            minHeight,
            maxHeight
        }),
        ref: containerRef
    }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("div", {
        style: (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$responsiveContainerUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getInnerDivStyle"])({
            width,
            height
        })
    }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](ResponsiveContainerContextProvider, {
        width: calculatedWidth,
        height: calculatedHeight
    }, children)));
});
var ResponsiveContainer = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    var responsiveContainerContext = useResponsiveContainerContext();
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$isWellBehavedNumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPositiveNumber"])(responsiveContainerContext.width) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$isWellBehavedNumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPositiveNumber"])(responsiveContainerContext.height)) {
        /*
     * If we detect that we are already inside another ResponsiveContainer,
     * we do not attempt to add another layer of responsiveness.
     */ return props.children;
    }
    var { width, height } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$responsiveContainerUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDefaultWidthAndHeight"])({
        width: props.width,
        height: props.height,
        aspect: props.aspect
    });
    /*
   * Let's try to get the calculated dimensions without having the div container set up.
   * Sometimes this does produce fixed, positive dimensions. If so, we can skip rendering the div and monitoring its size.
   */ var { calculatedWidth, calculatedHeight } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$responsiveContainerUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateChartDimensions"])(undefined, undefined, {
        width,
        height,
        aspect: props.aspect,
        maxHeight: props.maxHeight
    });
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(calculatedWidth) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(calculatedHeight)) {
        /*
     * If it just so happens that the combination of width, height, and aspect ratio
     * results in fixed dimensions, then we don't need to monitor the container's size.
     * We can just provide these fixed dimensions to the context.
     *
     * Note that here we are not checking for positive numbers;
     * if the user provides a zero or negative width/height, we will just pass that along
     * as whatever size we detect won't be helping anyway.
     */ return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](ResponsiveContainerContextProvider, {
            width: calculatedWidth,
            height: calculatedHeight
        }, props.children);
    }
    /*
   * Static analysis did not produce fixed dimensions,
   * so we need to render a special div and monitor its size.
   */ return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$thesis$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](SizeDetectorContainer, _extends({}, props, {
        width: width,
        height: height,
        ref: ref
    }));
});
}),
]);

//# sourceMappingURL=thesis_12ba3850._.js.map