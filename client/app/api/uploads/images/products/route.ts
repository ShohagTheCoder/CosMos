import { uploadImage } from "@/app/api/common/utils/uploadImage";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(req: any) {
    const outputDir = path.join(process.cwd(), "public/images/products/"); // Output file path
    const res = await uploadImage(req, "image", outputDir);
    if (res) {
        return NextResponse.json({
            status: "success",
            message: "Image upload successful",
        });
    } else {
        return NextResponse.json({
            status: "error",
            message: "Image upload successful",
        });
    }
}
