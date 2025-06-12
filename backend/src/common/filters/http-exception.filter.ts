import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let errorResponse: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    };

    // Handle different types of error responses
    if (typeof exceptionResponse === 'string') {
      errorResponse.message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      errorResponse = {
        ...errorResponse,
        ...exceptionResponse,
      };
    }

    // Add stack trace in development
    if (process.env.NODE_ENV !== 'production') {
      errorResponse.stack = exception.stack;
    }

    response.status(status).json(errorResponse);
  }
}
