import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable() // <--- This decorator is the magic!
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(creatorId, post) {
    return this.prisma.task.create({
      data: {
        title: post.title,
        description: post.description,
        dueDate: post.dueDate ? new Date(post.dueDate) : null,
        creatorId: creatorId.user.id,
      },
    });
  }

  async getAllPosts() {
    return this.prisma.task.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,

        assignments: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async removeAssignee(taskId: string, userId: string) {
    const count = await this.prisma.taskAssignment.count({
      where: {
        taskId,
      },
    });

    // Last assignee → delete task
    if (count === 1) {
      this.deletePost(taskId);
    }

    // Otherwise remove only this assignment
    return this.prisma.taskAssignment.delete({
      where: {
        taskId_userId: {
          taskId,
          userId,
        },
      },
    });
  }

  async deletePost(taskId: string) {
    return this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });
  }

  async updateTask(taskId, task) {
    console.log(taskId);
    console.log(task);
    return this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
      },
    });
  }

  async getAvailableUsers(taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
      select: {
        assignments: {
          select: {
            userId: true,
          },
        },
      },
    });

    const assignedIds = task?.assignments.map((a) => a.userId) ?? [];

    return this.prisma.user.findMany({
      where: {
        role: 'USER',
        id: {
          notIn: assignedIds,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
  async addAssignees(taskId: string, userIds: string[]) {
    await this.prisma.taskAssignment.createMany({
      data: userIds.map((userId) => ({
        taskId,
        userId,
      })),
      skipDuplicates: true,
    });

    return this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        assignments: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }
  
  async getMyTasks(userId: string) {
  return this.prisma.task.findMany({
    where: {
      assignments: {
        some: {
          userId,
        },
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      dueDate: true,
    },
    orderBy: {
      dueDate: "desc",
    },
  });
}
}
