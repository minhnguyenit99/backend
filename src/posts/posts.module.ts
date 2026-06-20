import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller.js';
import { PostsService } from './posts.service.js';

@Module({
  // No imports needed! PrismaService is automatically available to UsersService.
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}