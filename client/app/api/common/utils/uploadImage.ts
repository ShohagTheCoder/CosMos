import { promises as fs } from "fs"; // Use promises version of fs
import { NextResponse } from "next/server";
import path from "path";

export async function uploadImage(
    req: Request,
    fieldName: string,
    outputDir: string
) {
    try {
        // Parse the form data
        const formData = await req.formData();
        const image = formData.get(fieldName) as File;

        if (!image) {
            return NextResponse.json({
                message: `'${fieldName}' not found`,
                success: false,
            });
        }

        // Convert to Buffer
        const byteData = await image.arrayBuffer();
        const buffer = Buffer.from(byteData);

        // Create the output directory if it doesn't exist
        await fs.mkdir(outputDir, { recursive: true });

        // Save the image file with the original name
        const savedPath = path.join(outputDir, image.name);

        // Write the file
        await fs.writeFile(savedPath, buffer);

        return true;
    } catch (error) {
        console.error("Upload error:", error);
        return false;
    }
}
