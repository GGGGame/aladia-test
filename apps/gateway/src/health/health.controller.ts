import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  MicroserviceHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';
import { ConfigService } from '@aladia/config';
import { Transport } from '@nestjs/microservices';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private microservice: MicroserviceHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    const authHost = this.configService.get<string>('authHost');
    const authPort = this.configService.get<number>('authenticationPort');

    return await this.health.check([
      () =>
        this.microservice.pingCheck('auth-service', {
          transport: Transport.TCP,
          options: {
            host: authHost,
            port: authPort,
          },
        }),
    ]);
  }
}
