import fs from "fs";

export default function saveBase64Image(base64Str: any, filePath: any) {
    // Extract the data part of the Base64 string
    const base64Data = base64Str.replace(/^data:image\/\w+;base64,/, "");
    // Decode Base64 string to binary data
    const buffer = Buffer.from(base64Data, "base64");
    // Write binary data to file
    fs.writeFile(filePath, buffer, (err: any) => {
        if (err) {
            return false;
        }
        return true;
    });
}
