# Open Command Prompt and run mongod
Start-Process "cmd.exe" -ArgumentList "/k mongod"

# Open MongoDB Compass (adjust path if needed)
Start-Process "C:\Program Files\MongoDB Compass\mongodb-compass.exe"

# Open Visual Studio Code with the specified path
Start-Process "code" -ArgumentList "$path"

# Open new terminals in VSCode and run npm commands
Start-Process "code" -ArgumentList "$path --new-window"
Start-Sleep -Seconds 2
Start-Process "code" -ArgumentList "$path --command workbench.action.terminal.new"
Start-Sleep -Seconds 2
Start-Process "code" -ArgumentList "$path --command workbench.action.terminal.sendSequence --args '{\"text\": \"npm run dev\\r\"}'"
Start-Sleep -Seconds 2
Start-Process "code" -ArgumentList "$path --new-window"
Start-Sleep -Seconds 2
Start-Process "code" -ArgumentList "$path --command workbench.action.terminal.new"
Start-Sleep -Seconds 2
Start-Process "code" -ArgumentList "$path --command workbench.action.terminal.sendSequence --args '{\"text\": \"npm run dev\\r\"}'"

# Open Chrome and navigate to the specified URL
Start-Process "chrome.exe" -ArgumentList "http://localhost:3000/"
