import {
  Injectable,
  Logger,
  LoggerService as NestLoggerService,
} from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger = new Logger();

  log(message: string, context?: string): void {
    this.logger.log(message, context);
  }

  error(message: string | string[], trace?: string, context?: string): void {
    this.logger.error(message, trace, context);
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, context);
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, context);
  }
}
