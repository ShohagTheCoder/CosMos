// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "./app/api/auth/decodeJwt";
import { verify_access_token } from "./app/api/auth/verify_access_token";

export function middleware(req: NextRequest) {
    console.log("Middleware is running");

    const tokenCookie = req.cookies.get("access_token");
    const access_token = tokenCookie?.value || false; // Extract the token string

    if (!access_token) {
        console.log("No token, redirecting to login");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (!verify_access_token(access_token)) {
        console.log("Token is not valid, redirecting to login");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        const decoded = decodeJwt(access_token);
        return NextResponse.next();
    } catch (error) {
        console.log("Token verification failed, redirecting to login", error);
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

// Apply middleware to protected routes
export const config = {
    matcher: ["/sells/:path*"],
};
