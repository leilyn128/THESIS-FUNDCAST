module.exports = [
"[project]/thesis/.next-internal/server/app/api/forecast/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/thesis/app/api/forecast/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
const { spawn } = __turbopack_context__.r("[externals]/child_process [external] (child_process, cjs)");
const path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
const { NextResponse } = __turbopack_context__.r("[project]/thesis/node_modules/next/server.js [app-route] (ecmascript)");
async function POST(request) {
    return new Promise((resolve, reject)=>{
        // Define the correct path to model.py file
        const pyPath = path.join(("TURBOPACK compile-time value", "/ROOT/thesis/app/api/forecast"), "..", "..", "forecast", "model.py");
        // Set cwd to the directory where model.py exists
        const cwd = path.join(("TURBOPACK compile-time value", "/ROOT/thesis/app/api/forecast"), "..", "..", "forecast"); // this points to the 'forecast' folder
        // Spawn the Python process with the correct working directory
        const pythonPath = "C:\\Users\\ALDEGS09\\AppData\\Local\\Programs\\Python\\Python313\\python.exe";
        const python = spawn(pythonPath, [
            pyPath
        ], {
            stdio: [
                "pipe",
                "pipe",
                "pipe"
            ],
            cwd: cwd // Ensure Python is running in the correct folder
        });
        // Collect the output from Python
        let output = '';
        python.stdout.on("data", (data)=>{
            output += data.toString();
        });
        // Collect error data
        python.stderr.on("data", (data)=>{
            console.error(`stderr: ${data.toString()}`);
        });
        // When the Python process finishes
        python.on("close", (code)=>{
            if (code !== 0) {
                console.error(`Python process exited with code ${code}`);
                return resolve(NextResponse.json({
                    error: "Python process failed"
                }, {
                    status: 500
                }));
            }
            // Try parsing the Python output
            try {
                const parsedOutput = JSON.parse(output);
                resolve(NextResponse.json(parsedOutput, {
                    status: 200
                }));
            } catch (error) {
                console.error("Error parsing Python output:", error);
                resolve(NextResponse.json({
                    error: "Failed to parse Python output"
                }, {
                    status: 500
                }));
            }
        });
        // Handle errors from the Python process
        python.on("error", (error)=>{
            console.error("Error spawning Python process:", error);
            resolve(NextResponse.json({
                error: "Failed to spawn Python process"
            }, {
                status: 500
            }));
        });
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__80e4ee4f._.js.map