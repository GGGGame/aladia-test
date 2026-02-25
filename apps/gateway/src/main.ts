import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@aladia/config';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from '@aladia/common';
import { LoggerService } from '@aladia/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const logger = app.get(LoggerService);
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Aladia gateway test')
    .setDescription('Aladia test monorepo')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('gatewayPort');
  const host = configService.get<string>('listenHost');

  await app.listen(port, host);
  logger.log(`Gateway listening on ${host}:${port}`, 'Bootstrap');
}
void bootstrap();
