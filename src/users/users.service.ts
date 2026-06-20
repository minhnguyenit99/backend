// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable() // <--- This decorator is the magic!
export class UsersService {
  // Inject the single, shared database connection here
  constructor(private readonly prisma: PrismaService) {}

  // 1. Add 'id' to the parameters
  async syncUser(req) {
    return await this.prisma.user.upsert({
      where: { id: req.user.id }, // 2. Search by the unique Supabase ID
      update: {
        name: req.user.name,
        email: req.user.email, // Update email in case they changed it on Google
      },
      create: {
        id: req.user.id, // 3. Save the Supabase ID into your database
        name: req.user.name,
        email: req.user.email,
      },
    });
  }
  async getUser(req) {
    return await this.prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
  }
  async getAllUsers() {
    return await this.prisma.user.findMany({
      where: {
        NOT: {
          role: 'ADMIN',
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
}
