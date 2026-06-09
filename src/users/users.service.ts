// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserType } from 'type/type.js';

@Injectable() // <--- This decorator is the magic!
export class UsersService {

// Inject the single, shared database connection here
  constructor(private readonly prisma: PrismaService) {}
  
  // 1. Add 'id' to the parameters
  async syncUser(user:UserType) {
    console.log('from service')
    console.log(user);
    return await this.prisma.user.upsert({
      where: { id: user.id }, // 2. Search by the unique Supabase ID
      update: { 
        name: user.name,
        email: user.email     // Update email in case they changed it on Google
      }, 
      create: { 
        id: user.id,          // 3. Save the Supabase ID into your database
        name: user.name, 
        email: user.email 
      },
    });
  }
}