import { Module } from '@nestjs/common';
import { CoreModule } from '@aladia/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { CommonModule } from '@aladia/common';
import { AuthController } from './auth/auth.controller';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@aladia/config';
import { configuration } from '@aladia/config/environments/configuration';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 1000,
      max: 100,
    }),
    CommonModule,
    HealthModule,
    CoreModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
