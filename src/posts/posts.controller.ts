import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { Roles } from '../common/decorator/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Roles(Role.ADMIN)
  @Post()
  createPost(@Req() req, @Body() post) {
    return this.postsService.createTask(req, post);
  }

  @Roles(Role.ADMIN)
  @Get('all')
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Roles(Role.ADMIN)
  @Delete(':taskId/assignees/:userId')
  removeAssignee(
    @Param('taskId') taskId: string,
    @Param('userId') userId: string,
  ) {
    return this.postsService.removeAssignee(taskId, userId);
  }
  @Roles(Role.ADMIN)
  @Get(':taskId/available-users')
  getAvailableUsers(@Param('taskId') taskId: string) {
    return this.postsService.getAvailableUsers(taskId);
  }
  @Roles(Role.ADMIN)
  @Post(':taskId/assignees')
  addAssignees(
    @Param('taskId') taskId: string,
    @Body() body: { userIds: string[] },
  ) {
    return this.postsService.addAssignees(taskId, body.userIds);
  }
  @Roles(Role.ADMIN)
  @Delete(':taskId')
  deletePost(@Param('taskId') taskId: string) {
    return this.postsService.deletePost(taskId);
  }
  
  @Patch(':taskId')
  updateTask(@Param('taskId') taskId: string, @Body() task) {
    return this.postsService.updateTask(taskId, task);
  }

  @Get("my-tasks")
getMyTasks(@Req() req: any) {
  return this.postsService.getMyTasks(req.user.id);
}
}
