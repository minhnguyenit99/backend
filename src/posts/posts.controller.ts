import { Controller, Post, Body, Get, Req, Delete, Param, Patch, Query } from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { Roles } from '../common/decorator/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { AssignUsersDto } from './dto/assign-users.dto.js';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Roles(Role.ADMIN)
  @Post()
  createPost(@Req() req: any, @Body() taskDto: CreateTaskDto) {
    return this.postsService.createTask(req.user.id, taskDto);
  }

  @Roles(Role.ADMIN)
  @Get('all')
  getAllPosts(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.postsService.getAllPosts(skip ? parseInt(skip, 10) : 0, take ? parseInt(take, 10) : 50);
  }

  @Roles(Role.ADMIN)
  @Delete(':taskId/assignees/:userId')
  removeAssignee(@Param('taskId') taskId: string, @Param('userId') userId: string) {
    return this.postsService.removeAssignee(taskId, userId);
  }

  @Roles(Role.ADMIN)
  @Get(':taskId/available-users')
  getAvailableUsers(@Param('taskId') taskId: string) {
    return this.postsService.getAvailableUsers(taskId);
  }

  @Roles(Role.ADMIN)
  @Post(':taskId/assignees')
  addAssignees(@Param('taskId') taskId: string, @Body() dto: AssignUsersDto) {
    return this.postsService.addAssignees(taskId, dto.userIds);
  }

  @Roles(Role.ADMIN)
  @Delete(':taskId')
  deletePost(@Param('taskId') taskId: string) {
    return this.postsService.deletePost(taskId);
  }

  @Patch(':taskId')
  updateTask(@Param('taskId') taskId: string, @Body() taskDto: UpdateTaskDto) {
    return this.postsService.updateTask(taskId, taskDto);
  }

  @Get('my-tasks')
  getMyTasks(@Req() req: any) {
    return this.postsService.getMyTasks(req.user.id);
  }
}