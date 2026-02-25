import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserRto {
  @ApiProperty({ example: 'user@aladia.io', description: 'User email' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'Davide', description: 'Username' })
  @Expose()
  username: string;

  @ApiProperty({
    example: 'object_id_example',
    description: 'Unique database identifier',
  })
  @Expose()
  _id: string;
}
