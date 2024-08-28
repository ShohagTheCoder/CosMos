import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return NextResponse.json(
        {
            success: true,
        },
        {
            headers: {
                "Set-Cookie": "access_token=empty; path=/; Max-Age=0",
            },
        }
    );
}
