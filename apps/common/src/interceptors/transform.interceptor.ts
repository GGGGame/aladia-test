import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponse } from '../RTO/base-response.rto';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  BaseResponse<T>
> {
  intercept(
    _context: ExecutionContext, // just required by NestInterceptor
    next: CallHandler,
  ): Observable<BaseResponse<T>> {
    return next.handle().pipe(
      map((data: T) => {
        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
