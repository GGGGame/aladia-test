import { Module } from '@nestjs/common';
import { CoreModule } from '@aladia/core';
import { ConfigModule, ConfigService } from '@aladia/config';
import { configuration } from '@aladia/config/environments/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user/user.schema';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserRepository } from './user/user.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const user = configService.get<string>('mongodbUser');
        const password = configService.get<string>('mongodbPassword');
        const host = configService.get<string>('mongodbHost');
        const port = configService.get<string>('mongodbPort');
        const database = configService.get<string>('mongodbDatabase');
        return {
          uri: `mongodb://${user}:${password}@${host}:${port}/${database}?authSource=admin`,
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    CoreModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class AuthenticationModule {}
