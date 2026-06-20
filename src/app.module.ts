import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthGuard } from './common/auth.guard.js';
import { RolesGuard } from './common/roles.guard.js';
import { APP_GUARD } from '@nestjs/core';
import { PostsModule } from './posts/posts.module.js';

@Module({
  imports: [PrismaModule, UsersModule, PostsModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ]
})
export class AppModule {}
