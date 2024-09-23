// utils/axiosConfig.js
import axios from "axios";
import Cookies from "js-cookie";

// Create a single Axios instance with a default configuration
const apiClient = axios.create({
    baseURL: process.env.API_BASE_URL,
    timeout: 5000, // Adjust timeout as needed
    headers: {
        Authorization: `Bearer ${Cookies.get("access_token")}`,
    },
});

export default apiClient;
