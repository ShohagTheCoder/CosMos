import { ApiResponse } from '../interfaces/api-response.interface';

export class Response<T = any> {
    private response: ApiResponse<T> & {
        limit?: number;
        page?: number;
        totalDocuments?: number;
        totalPages?: number;
    };

    constructor(message: string = 'Operation successful') {
        // Initialize default response structure with the provided or default message
        this.response = {
            status: 'success',
            code: 200,
            message,
            data: null,
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
    done(): ApiResponse<T> & {
        limit?: number;
        page?: number;
        totalDocuments?: number;
        totalPages?: number;
    } {
        return this.response;
    }
}
