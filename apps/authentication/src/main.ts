import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthenticationModule } from './authentication.module';
import { ConfigService } from '@aladia/config';
import { ValidationPipe } from '@nestjs/common';
import { LoggerService } from '@aladia/core';

async function bootstrap() {
  const app = await NestFactory.create(AuthenticationModule);
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const logger = app.get(LoggerService);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('authenticationPort');
  const host = configService.get<string>('listenHost');

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.TCP,
      options: {
        host: host,
        port: port,
      },
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();

  logger.log(`Authentication listening on ${host}:${port}`, 'Bootstrap');
}
void bootstrap();
