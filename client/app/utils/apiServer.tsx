// // "use server";
// import axios from "axios";
// import { cookies } from "next/headers";

// const cookiesList = cookies();
// const accessToken = cookiesList.get("access_token")?.value;

// const apiServer = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
//     timeout: 5000, // Adjust timeout as needed
//     headers: {
//         Authorization: `Bearer ${accessToken}`, // Set the Authorization header if token is present
//     },
// });

// export default apiServer;

import axios from "axios";
import { cookies } from "next/headers";

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

// Create an axios instance
const apiServer = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 5000,
    headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined, // Set Authorization header only if token is present
});

export default apiServer;
