import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      error: typeof message === 'string' ? message : (message as any).message,
      driverError:
        exception instanceof QueryFailedError
          ? exception.driverError?.detail
          : '',
      exception: process.env.NODE_ENV === 'development' ? exception : null,
    };
    console.error(errorResponse);
    response.status(status).json(errorResponse);
  }

  private extractData(message: any): any {
    if (typeof message === 'object' && message.message) {
      return message.message;
    }
    return message;
  }
}
