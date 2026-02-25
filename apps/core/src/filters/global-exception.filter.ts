import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
import { toExceptionLike, HttpExceptionResponse } from '@aladia/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly context = GlobalExceptionFilter.name;

  constructor(private readonly logger: LoggerService) { }

  catch(exception: unknown, host: ArgumentsHost): void | Observable<never> {
    const contextType = host.getType();
    const { status, message } = this.resolveException(exception);

    const ex = toExceptionLike(exception);
    this.logger.error(
      message,
      ex.stack ?? JSON.stringify(exception),
      this.context,
    );

    if (contextType === 'rpc') {
      return throwError(
        () => new RpcException({ statusCode: status, message }),
      );
    }

    host.switchToHttp().getResponse<Response>().status(status).json({
      success: false,
      message,
      data: null,
      timestamp: new Date().toISOString(),
    });
  }

  private resolveException(exception: unknown): {
    status: number;
    message: string;
  } {
    if (exception instanceof HttpException) {
      const res = exception.getResponse() as HttpExceptionResponse;
      const msg = Array.isArray(res?.message)
        ? res.message[0]
        : (res?.message ?? exception.message);
      return { status: exception.getStatus(), message: msg };
    }

    const ex = toExceptionLike(exception);

    if (ex.code === 11000) {
      return { status: HttpStatus.CONFLICT, message: 'Already exists' };
    }

    const msg = Array.isArray(ex.response?.message)
      ? ex.response.message[0]
      : (ex.response?.message ?? ex.message ?? 'Internal server error');

    const rawStatus = ex.statusCode ?? ex.status;
    return {
      status:
        typeof rawStatus === 'number'
          ? rawStatus
          : HttpStatus.INTERNAL_SERVER_ERROR,
      message: msg,
    };
  }
}
