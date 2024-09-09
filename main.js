const { app, BrowserWindow } = require("electron");

function runNextJs() {
    const nextProcess = spawn("npm", ["run", "dev"], { cwd: path.join(__dirname, "path_to_nextjs") });

    nextProcess.stdout.on("data", (data) => {
        console.log(`Next.js: ${data}`);
    });

    nextProcess.stderr.on("data", (data) => {
        console.error(`Next.js Error: ${data}`);
    });

    nextProcess.on("close", (code) => {
        console.log(`Next.js process exited with code ${code}`);
    });
}

function runNestJs() {
    const nestProcess = spawn("npm", ["run", "dev"], { cwd: path.join(__dirname, "path_to_nestjs") });

    nestProcess.stdout.on("data", (data) => {
        console.log(`NestJS: ${data}`);
    });

    nestProcess.stderr.on("data", (data) => {
        console.error(`NestJS Error: ${data}`);
    });

    nestProcess.on("close", (code) => {
        console.log(`NestJS process exited with code ${code}`);
    });
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        height: 600,
        width: 600,
    });

    mainWindow.loadURL("http://localhost:3000/");
};

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
