// // import { exec, spawn } from "child_process";
// // import
// // import open from "open";

// // // Start Next.js
// // const nextProcess = exec("cd client && npm run dev", (error) => {
// //     if (error) {
// //         console.error("Error starting Next.js:", error);
// //         return;
// //     }

// //     console.log("Next.js started successfully");
// // });

// // // Start Nest.js
// // const nestProcess = exec("cd server && npm run dev", (error) => {
// //     if (error) {
// //         console.error("Error starting Nest.js:", error);
// //         return;
// //     }

// //     console.log("Nest.js started successfully");
// // });

// // // Open browser after a small delay
// // setTimeout(() => {
// //     open("http://localhost:3000");
// // }, 5000);

// // process.on("exit", () => {
// //     nextProcess.kill();
// //     nestProcess.kill();
// // });

// // // Optionally handle SIGINT for graceful shutdown
// // process.on("SIGINT", () => {
// //     nextProcess.kill();
// //     nestProcess.kill();
// //     process.exit();
// // });

// function runNextJs() {
//     const nextProcess = spawn("npm", ["run", "dev"], { cwd: path.join(__dirname, "path_to_nextjs") });

//     nextProcess.stdout.on("data", (data) => {
//         console.log(`Next.js: ${data}`);
//     });

//     nextProcess.stderr.on("data", (data) => {
//         console.error(`Next.js Error: ${data}`);
//     });

//     nextProcess.on("close", (code) => {
//         console.log(`Next.js process exited with code ${code}`);
//     });
// }

// function runNestJs() {
//     const nestProcess = spawn("npm", ["run", "dev"], { cwd: path.join(__dirname, "path_to_nestjs") });

//     nestProcess.stdout.on("data", (data) => {
//         console.log(`NestJS: ${data}`);
//     });

//     nestProcess.stderr.on("data", (data) => {
//         console.error(`NestJS Error: ${data}`);
//     });

//     nestProcess.on("close", (code) => {
//         console.log(`NestJS process exited with code ${code}`);
//     });
// }

// runNestJs();
// runNextJs();
