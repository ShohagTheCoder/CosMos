// app/api/auth/route.ts
import { NextResponse } from "next/server";
import apiClient from "@/app/utils/apiClient";
import { decodeJwt } from "./decodeJwt";
import { ApiResponse } from "@/app/common/apiCall";

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        console.log(username, password);

        // Call the login API
        const { data } = await apiClient.post<
            ApiResponse<{ access_token: string }>
        >("auth/login", {
            username,
            password,
        });

        const { status, code, message, data: responseData } = data;

        if (status === "success" && responseData?.access_token) {
            const access_token = responseData.access_token;
            const response = NextResponse.json({
                status: "success",
                code: code || 200,
                message: "Login successful",
                data: { access_token },
            });

            // Set a cookie with the token or session identifier
            response.cookies.set("access_token", access_token, {
                httpOnly: false,
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
                status: "error",
                code: 401,
                message: message || "Invalid credentials",
                data: null,
            });
        }
    } catch (error) {
        return NextResponse.json({
            status: "error",
            code: 500,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal server error",
            data: null,
        });
    }
}
