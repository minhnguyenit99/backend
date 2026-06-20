import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../generated/prisma/enums.js';
import { ROLES_KEY } from './decorator/roles.decorator.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), context.getClass(),
    ]);

    if (!roles || roles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const dbUser = await this.prisma.user.findUnique({
      where: { id: request.user.id },
      select: { role: true } 
    });

    if (!dbUser) throw new ForbiddenException('User not synced in database');
    if (!roles.includes(dbUser.role)) throw new ForbiddenException('Insufficient permissions');

    return true;
  }
}