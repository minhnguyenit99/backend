import { Module } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

@Module({
  // No imports needed! PrismaService is automatically available to UsersService.
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}