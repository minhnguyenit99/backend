import { Controller, Post, Get, Req, Query } from '@nestjs/common';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sync')
  syncUser(@Req() req: any) {
    return this.usersService.syncUser(req.user.id, req.user.name, req.user.email);
  }

  @Get('me')
  getMe(@Req() req: any) {
    return this.usersService.getUser(req.user.id);
  }

  @Get()
  getAllUsers(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.usersService.getAllUsers(
      skip ? parseInt(skip, 10) : 0, 
      take ? parseInt(take, 10) : 50
    );
  }
}