@echo off

:: Set the path to the project folder
set projectPath=E:\TheCoder\CosMos

:: Open VSCode with the project folder
start "" "code %projectPath%"

:: Wait for VSCode to start
timeout /t 10 /nobreak > NUL

:: Open the integrated terminal in VSCode and run commands in each terminal
:: (This assumes that VSCode's integrated terminal will start in the project's root directory)

:: Run npm run dev for the server in the first terminal
code --new-window --command "workbench.action.terminal.new" --command "workbench.action.terminal.sendSequence" --args "{ \"text\": \"cd server && npm run dev\\n\" }"

:: Run npm run dev for the client in the second terminal
code --new-window --command "workbench.action.terminal.new" --command "workbench.action.terminal.sendSequence" --args "{ \"text\": \"cd client && npm run dev\\n\" }"

:: Open Chrome with the specified URL
start chrome http://localhost:3000/
