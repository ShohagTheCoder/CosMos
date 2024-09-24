// src/common/interfaces/api-response.interface.ts
export interface ApiResponse<T = any> {
    status: 'success' | 'error'; // Whether the response is successful or contains an error
    code: number; // HTTP status code (e.g., 200, 400, 500)
    message: string; // Descriptive message explaining the result or error
    data: T | null; // Payload data (null in case of error)
}
