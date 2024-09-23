import axios, { AxiosInstance, AxiosResponse } from "axios";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Standardized API Response interface
export interface ApiResponse<T = any> {
    status: "success" | "error"; // Whether the response is successful or contains an error
    code: number; // HTTP status code (e.g., 200, 400, 500)
    message: string; // Descriptive message explaining the result or error
    data: T | null; // Payload data (null in case of error)
    timestamp?: string; // Optional timestamp for error or success events
    path?: string; // Optional path to the endpoint (for errors mainly)
}

class ApiCall {
    private axiosInstance: AxiosInstance;
    private successCallback: (data: any) => void = () => {};
    private errorCallback: (error: Error) => void = () => {};
    private finallyCallback: () => void = () => {};

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Set base URL from .env
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    // Unified request method
    async request(method: string, url: string, payload?: any): Promise<this> {
        try {
            const response: AxiosResponse<ApiResponse> =
                await this.axiosInstance.request({
                    method,
                    url,
                    data: payload,
                });

            // Handle the response based on the status of the ApiResponse
            if (response.data.status === "error") {
                throw new Error(response.data.message); // Server-side error message
            }

            this.successCallback(response.data.data); // Call success callback with data
        } catch (error: any) {
            // Use detailed error message if available, otherwise generic
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Unknown error";
            this.errorCallback(new Error(errorMessage)); // Call error callback with message
        } finally {
            this.finallyCallback(); // Call finally callback
        }

        return this; // Return the instance for chaining
    }

    // Define HTTP methods
    public get(url: string): this {
        this.request("GET", url);
        return this; // Allow chaining
    }

    public post(url: string, payload: any): this {
        this.request("POST", url, payload);
        return this; // Allow chaining
    }

    public put(url: string, payload: any): this {
        this.request("PUT", url, payload);
        return this; // Allow chaining
    }

    public patch(url: string, payload: any): this {
        this.request("PATCH", url, payload);
        return this; // Allow chaining
    }

    public delete(url: string): this {
        this.request("DELETE", url);
        return this; // Allow chaining
    }

    // Success callback registration
    public success(callback: (data: any) => void): this {
        this.successCallback = callback;
        return this; // Allow chaining
    }

    // Error callback registration
    public error(callback: (error: Error) => void): this {
        this.errorCallback = callback;
        return this; // Allow chaining
    }

    // Finally callback registration
    public finally(callback: () => void): this {
        this.finallyCallback = callback;
        return this; // Allow chaining
    }
}

const apiCall = new ApiCall();
export default apiCall;
