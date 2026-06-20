import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Role } from '../generated/prisma/enums.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

const TASK_WITH_ASSIGNEES_SELECT = {
  id: true, title: true, description: true, status: true, dueDate: true,
  assignments: { select: { user: { select: { id: true, name: true, email: true } } } },
};

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(creatorId: string, post: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: post.title, description: post.description,
        dueDate: post.dueDate ? new Date(post.dueDate) : null,
        creatorId, 
      },
    });
  }

  async getAllPosts(skip: number, take: number) {
    return this.prisma.task.findMany({
      skip, take, orderBy: { createdAt: 'desc' }, select: TASK_WITH_ASSIGNEES_SELECT,
    });
  }

  async removeAssignee(taskId: string, userId: string) {
    const count = await this.prisma.taskAssignment.count({ where: { taskId } });
    if (count <= 1) return this.deletePost(taskId);
    return this.prisma.taskAssignment.delete({ where: { taskId_userId: { taskId, userId } } });
  }

  async deletePost(taskId: string) {
    return this.prisma.task.delete({ where: { id: taskId } });
  }

  async updateTask(taskId: string, task: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...(task.title && { title: task.title }),
        ...(task.description && { description: task.description }),
        ...(task.status && { status: task.status }),
        ...(task.dueDate && { dueDate: new Date(task.dueDate) }),
      },
    });
  }

  async getAvailableUsers(taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId }, select: { assignments: { select: { userId: true } } },
    });
    const assignedIds = task?.assignments.map((a) => a.userId) ?? [];
    return this.prisma.user.findMany({
      where: { role: Role.USER, id: { notIn: assignedIds } },
      select: { id: true, name: true, email: true }, orderBy: { name: 'asc' },
    });
  }

  async addAssignees(taskId: string, userIds: string[]) {
    await this.prisma.taskAssignment.createMany({
      data: userIds.map((userId) => ({ taskId, userId })), skipDuplicates: true,
    });
    return this.prisma.task.findUnique({ where: { id: taskId }, select: TASK_WITH_ASSIGNEES_SELECT });
  }

  async getMyTasks(userId: string) {
    return this.prisma.task.findMany({
      where: { assignments: { some: { userId } } },
      select: { id: true, title: true, description: true, status: true, dueDate: true },
      orderBy: { dueDate: 'desc' },
    });
  }
}