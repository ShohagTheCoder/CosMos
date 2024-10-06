// src/common/interfaces/api-response.interface.ts
export interface ApiResponse<T = any> {
    status: 'success' | 'error'; // Whether the response is successful or contains an error
    code: number; // HTTP status code (e.g., 200, 400, 500)
    message: string; // Descriptive message explaining the result or error
    data: T | null; // Payload data (null in case of error)
    errors?: any | null; // Errors in case of error
    page?: number | null; // Current page number for paginated responses
    totalDocuments?: number | null; // Total number of documents for paginated responses
    totalPages?: number | null; // Total number of pages for paginated responses
    limit?: number | null; // Number of items per page for paginated responses
}

export class Response<T = any> {
    private response: ApiResponse<T>;

    constructor(message: string = 'Operation successful') {
        // Initialize default response structure with the provided or default message
        this.response = {
            status: 'success',
            code: 200,
            message,
            data: null,
            errors: null, // Ensure `errors` is initialized
            page: null,
            totalDocuments: null,
            totalPages: null,
            limit: null,
        };
    }

    // Set success status and default success message
    success(message: string = this.response.message): this {
        this.response.status = 'success';
        this.response.code = 200;
        this.response.message = message;
        return this;
    }

    // Set error status and custom error code
    error(message: string, code: number = 500): this {
        this.response.status = 'error';
        this.response.code = code;
        this.response.message = message;
        this.response.data = null;
        return this;
    }

    // Customize the message
    message(message: string): this {
        this.response.message = message;
        return this;
    }

    // Attach data to the response
    data(data: T): this {
        this.response.data = data;
        return this;
    }

    // Attach errors to the response
    errors(errors: any): this {
        this.response.errors = errors;
        return this;
    }

    // Add pagination fields as optional
    page(page: number): this {
        this.response.page = page;
        return this;
    }

    limit(limit: number): this {
        this.response.limit = limit;
        return this;
    }

    totalDocuments(totalDocuments: number): this {
        this.response.totalDocuments = totalDocuments;
        return this;
    }

    totalPages(totalPages: number): this {
        this.response.totalPages = totalPages;
        return this;
    }

    // Explicitly finalize and return the response
    done(): ApiResponse<T> {
        return this.response;
    }
}
