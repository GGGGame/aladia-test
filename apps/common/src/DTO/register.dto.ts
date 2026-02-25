import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@aladia.io', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Password (min 6 chars, 1 upper, 1 lower, 1 number, 1 symbol)',
  })
  @IsString()
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @ApiProperty({ example: 'Davide', description: 'Username' })
  @IsString()
  @IsNotEmpty()
  username: string;
}
