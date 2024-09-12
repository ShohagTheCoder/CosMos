import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";

export async function POST(req: any) {
    const data = await req.formData();
    const image = data.get("image");

    if (!image) {
        return NextResponse.json({
            message: "No image found",
            success: false,
        });
    }

    const byteData = await image.arrayBuffer();
    const buffer = Buffer.from(byteData);
    const path = `./public/images/products/${data.SKU + image.name}`;
    await writeFile(path, buffer);
    return NextResponse.json({
        message: "Image uploaded successfully",
        success: true,
    });
}
