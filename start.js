import { exec } from "child_process";
import open from "open";

// Start next.js
const nextProcess = exec("cd client && npm run dev", (error) => {
    if (error) {
        console.error("Error starting Next.js:", error);
        return;
    }

    console.log("Next.js started successfully");
});

// Start nest.js
const nestProcess = exec("cd server && npm run dev", (error) => {
    if (error) {
        console.error("Error starting Nest.js:", error);
        return;
    }

    console.log("Nest.js started successfully");
});

// Open browser after a small delay
setTimeout(() => {
    open("http://localhost:3000");
}, 5000);

process.on("exit", () => {
    nextProcess.kill();
    nestProcess.kill();
});
