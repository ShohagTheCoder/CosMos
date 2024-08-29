// app/api/auth/route.ts
import { NextResponse } from "next/server";
import apiClient from "@/app/utils/apiClient";

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();
        const { data } = await apiClient.post("auth/login", {
            username,
            password,
        });
        const access_token = data.access_token;
        if (access_token) {
            return NextResponse.json(
                {
                    success: true,
                    message: "Authentication successful",
                },
                {
                    headers: {
                        "Set-Cookie": `access_token=${access_token}; path=/; Max-Age=43200`,
                    },
                }
            );
        } else {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials",
            });
        }
    } catch (error) {
        console.error("Error processing authentication request:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error",
        });
    }
}
