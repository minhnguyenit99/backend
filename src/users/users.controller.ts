import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { Roles } from '../common/decorator/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sync')
  syncUser(@Req() req) {
    return this.usersService.syncUser(req);
  }

  // @Roles(Role.ADMIN)
  @Get('me')
  getMe(@Req() req) {
    return this.usersService.getUser(req)
  }

  @Get()
  getAllUsers(){
    return this.usersService.getAllUsers()
  }
}
