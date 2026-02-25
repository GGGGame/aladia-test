export interface ExceptionLike {
  stack?: string;
  message?: string;
  statusCode?: number;
  status?: number;
  code?: number;
  response?: {
    message?: string | string[];
  };
}

export interface HttpExceptionResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

export interface MongoError {
  code: number;
  keyPattern?: Record<string, number>;
  keyValue?: Record<string, any>;
}

export function toExceptionLike(e: unknown): ExceptionLike {
  return (typeof e === 'object' && e !== null ? e : {}) as ExceptionLike;
}
