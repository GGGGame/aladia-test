import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { NetworkingService } from './networking.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@aladia/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTHENTICATION_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('authHost'),
            port: configService.get<number>('authenticationPort'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [CommonService, NetworkingService],
  exports: [CommonService, NetworkingService, ClientsModule],
})
export class CommonModule {}
