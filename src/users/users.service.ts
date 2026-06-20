import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async syncUser(id: string, name: string, email: string) {
    return await this.prisma.user.upsert({
      where: { id },
      update: { name, email },
      create: { id, name, email },
    });
  }

  async getUser(userId: string) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async getAllUsers(skip: number, take: number) {
    return await this.prisma.user.findMany({
      skip, take,
      where: { NOT: { role: 'ADMIN' } },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' }
    });
  }
}