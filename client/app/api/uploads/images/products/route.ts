import saveBase64Image from "@/app/api/functions/saveBase64Image";
import { NextResponse } from "next/server";

export async function POST(req: any) {
    const outputDir = "public/images/products/"; // Output file path
    try {
        // Parse the form data
        const formData = await req.formData();
        const image = formData.get("image");
        const imageName = formData.get("imageName");

        if (!image || !imageName) {
            return NextResponse.json({
                message: "'image' or 'imageName' not found",
                success: false,
            });
        }

        // Save the image
        saveBase64Image(image, outputDir + imageName);

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
