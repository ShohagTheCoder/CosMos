import fs from "fs";
import path from "path";

export default function saveBase64Image(base64Str: string, filePath: string) {
    // Extract the directory from the file path
    const dir = path.dirname(filePath);

    // Check if the directory exists, and if not, create it
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true }); // Create directories recursively
    }

    // Extract the data part of the Base64 string
    const base64Data = base64Str.replace(/^data:image\/\w+;base64,/, "");

    // Decode Base64 string to binary data
    const buffer = Buffer.from(base64Data, "base64");

    // Write binary data to file
    fs.writeFile(filePath, buffer, (err) => {
        if (err) {
            console.error("Failed to save image:", err);
            return false;
        }
        console.log("Image saved successfully!");
        return true;
    });
}
