import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { RegisterDto } from '@aladia/common';
import { LoggerService } from '@aladia/core';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly context = UserService.name;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: LoggerService,
  ) {}

  async create(registerDto: RegisterDto) {
    const existingEmail = await this.userRepository.findByEmail(
      registerDto.email,
    );
    if (existingEmail) {
      this.logger.warn(
        `Email already in use: ${registerDto.email}`,
        this.context,
      );
      throw new BadRequestException('Email already exists');
    }

    const existingUsername = await this.userRepository.findByUsername(
      registerDto.username,
    );
    if (existingUsername) {
      this.logger.warn(
        `Username already in use: ${registerDto.username}`,
        this.context,
      );
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });
    this.logger.log(`User with email: ${user.email} created!`, this.context);
    return user;
  }

  async findAll() {
    this.logger.log('All users in database:', this.context);
    return await this.userRepository.findAll();
  }
}
