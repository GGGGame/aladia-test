import {
  Body,
  Controller,
  Get,
  Post,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, UserRto } from '@aladia/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
    type: UserRto,
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return plainToInstance(UserRto, user, { excludeExtraneousValues: true });
  }

  @Get('users')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get all users (cached 60s in-memory)' })
  @ApiResponse({
    status: 200,
    description: 'List of all users.',
    type: [UserRto],
  })
  async getUsers() {
    const users = await this.authService.getUsers();
    return plainToInstance(UserRto, users, { excludeExtraneousValues: true });
  }
}
