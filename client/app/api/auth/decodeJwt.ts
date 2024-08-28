// Utility function to decode Base64Url
function base64UrlDecode(str: string) {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(decoded);
}

// Decode JWT without verification
export function decodeJwt(token: string) {
    const parts = token.split(".");
    if (parts.length !== 3) {
        throw new Error("Invalid token");
    }
    const payload = base64UrlDecode(parts[1]);
    return payload;
}
