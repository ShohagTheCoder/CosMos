// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verify_access_token } from "./app/api/auth/verify_access_token";

export function middleware(req: NextRequest) {
    const tokenCookie = req.cookies.get("access_token");
    const access_token = tokenCookie?.value || false; // Extract the token string

    if (access_token && verify_access_token(access_token)) {
        return NextResponse.next();
    } else {
        const response = NextResponse.redirect(new URL("/login", req.url));
        response.cookies.set("access_token", "", {
            path: "/",
            expires: new Date(0),
        });
        return response;
    }
}

// Apply middleware to protected routes
export const config = {
    matcher: ["/actions/:path*"],
};
