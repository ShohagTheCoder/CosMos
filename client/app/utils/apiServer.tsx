import axios from "axios";
import { cookies } from "next/headers";

// Create an axios instance
const apiServer = () => {
    // Check if the code is running on the server
    const isServer = typeof window === "undefined";

    // Get the access token based on the environment
    const accessToken = isServer
        ? cookies().get("access_token")?.value
        : typeof document !== "undefined"
        ? document.cookie
              .split("; ")
              .find((row) => row.startsWith("access_token="))
              ?.split("=")[1]
        : undefined;

    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        timeout: 5000,
        headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : undefined, // Set Authorization header only if token is present
    });
};

export default apiServer;
