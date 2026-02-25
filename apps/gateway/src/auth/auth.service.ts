import { IUser, NetworkingService, RegisterDto } from '@aladia/common';
import { LoggerService } from '@aladia/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly context = AuthService.name;

  constructor(
    private readonly networkingService: NetworkingService,
    private readonly logger: LoggerService,
  ) {}

  async register(registerDto: RegisterDto): Promise<IUser> {
    this.logger.log(`Creating new user: ${registerDto.email}`, this.context);
    return await this.networkingService.send<IUser>(
      'register_user',
      registerDto,
    );
  }

  async getUsers(): Promise<IUser[]> {
    this.logger.log('Fetching all users', this.context);
    return await this.networkingService.send<IUser[]>('get_all_users', {});
  }
}
