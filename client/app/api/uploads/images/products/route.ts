import { promises as fs } from "fs"; // Use promises version of fs
import { NextResponse } from "next/server";
import path from "path";

export async function POST(req: any) {
    const outputDir = path.join(process.cwd(), "public/images/products/"); // Output file path
    try {
        // Parse the form data
        const formData = await req.formData();
        const image = formData.get("image") as File;

        if (!image) {
            return NextResponse.json({
                message: "'image' not found",
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

        return NextResponse.json({
            message: "Image uploaded successfully",
            success: true,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({
            message: "Error uploading image",
            success: false,
        });
    }
}
