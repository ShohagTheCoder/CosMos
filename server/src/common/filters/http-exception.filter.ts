// src/common/filters/http-exception.filter.ts

import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // If it's an HttpException, get the status and message from it
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.message
                : exception.message || 'Internal server error';

        const errorResponse = {
            status: 'error',
            code: status,
            message, // Extract message from exception or provide a default one
            timestamp: new Date().toISOString(),
            path: request.url,
            data: null,
        };

        response.status(status).json(errorResponse);
    }
}
