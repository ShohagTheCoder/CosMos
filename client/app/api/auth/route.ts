// app/api/auth/route.ts
import { NextResponse } from "next/server";
import apiClient from "@/app/utils/apiClient";
import { decodeJwt } from "./decodeJwt";

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();
        const { data } = await apiClient.post("auth/login", {
            username,
            password,
        });
        const access_token = data.access_token;
        if (access_token) {
            const response = NextResponse.json({ success: true });

            // Set a cookie with the token or session identifier
            response.cookies.set("access_token", access_token, {
                httpOnly: true,
                path: "/",
                maxAge: 60 * 60 * 24, // 1 day
            });

            const user = decodeJwt(access_token);
            // Set user data in cookies
            response.cookies.set("user-id", String(user.sub), {
                path: "/",
                httpOnly: false,
                maxAge: 60 * 60 * 24, // 1 day
            });

            return response;
        } else {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials",
            });
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Invalid credentials",
        });
    }
}
