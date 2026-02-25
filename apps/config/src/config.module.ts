import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import {
  ConfigModule as NestConfigModule,
  ConfigModuleOptions,
} from '@nestjs/config';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {
  static forRoot(options: ConfigModuleOptions): DynamicModule {
    return {
      module: ConfigModule,
      imports: [NestConfigModule.forRoot(options)],
      providers: [ConfigService],
      exports: [ConfigService, NestConfigModule],
    };
  }
}
