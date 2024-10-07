import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 5000, // Adjust timeout as needed
    headers: {
        Authorization: `Bearer ${Cookies.get("access_token")}`, // Set the Authorization header if token is present
    },
});

export default apiClient;
