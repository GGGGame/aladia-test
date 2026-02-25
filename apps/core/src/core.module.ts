import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { LoggerModule } from './logger/logger.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

@Module({
  imports: [LoggerModule],
  providers: [
    CoreService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  exports: [CoreService, LoggerModule],
})
export class CoreModule {}
