import { spawn } from "child_process";
import open from "open";

// Function to start a process in a specific directory
const startProcess = (command, args, name, workingDirectory) => {
    const process = spawn(command, args, {
        cwd: workingDirectory, // Set the working directory for the command
        stdio: "inherit",
        shell: true,
    });

    process.on("close", (code) => {
        if (code !== 0) {
            console.error(`${name} exited with code ${code}`);
        } else {
            console.log(`${name} exited successfully`);
        }
    });

    return process;
};

// Start Next.js in 'client' folder
const nextProcess = startProcess("npm", ["run", "dev"], "Next.js", "client");

// Start Nest.js in 'server' folder
const nestProcess = startProcess("npm", ["run", "dev"], "Nest.js", "server");

// Open browser after a small delay
setTimeout(() => {
    open("http://localhost:3000");
}, 10000);

// Handle process exit and cleanup
process.on("exit", () => {
    nextProcess.kill();
    nestProcess.kill();
});

// Optionally handle SIGINT for graceful shutdown
process.on("SIGINT", () => {
    nextProcess.kill();
    nestProcess.kill();
    process.exit();
});
