export class BaseResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  timestamp: string;

  constructor(data: T, message?: string, success = true) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}
