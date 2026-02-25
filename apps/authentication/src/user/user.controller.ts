import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RegisterDto } from '@aladia/common';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('register_user')
  async register(@Payload() data: RegisterDto) {
    return await this.userService.create(data);
  }

  @MessagePattern('get_all_users')
  async getUsers() {
    return await this.userService.findAll();
  }
}
