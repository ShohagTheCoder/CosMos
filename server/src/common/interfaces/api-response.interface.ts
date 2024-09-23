// src/common/interfaces/api-response.interface.ts
export interface ApiResponse<T = any> {
    status: 'success' | 'error';
    code: number; // HTTP status code
    message: string; // Descriptive message
    data: T | null; // Data payload for success or null for error
}
