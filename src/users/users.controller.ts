import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from './users.service.js';
import type { UserType } from 'type/type.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sync')
  // Tell NestJS to expect the entire body to match your UserType
  async syncUser(@Body() user: UserType) {
    console.log('from controller');
    console.log(user);
    // Pass the entire object directly to your service
    return this.usersService.syncUser(user);
  }

  @Get('test')
  test() {
    return 'working';
  }
}
