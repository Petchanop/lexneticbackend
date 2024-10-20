import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseInterceptors, UsePipes } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { createTaskDto, updateTaskDto } from './dto/tasks.dto';
import { Task } from './entities/tasks.entity';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import * as slugid from 'slugid';
import { SlugIdInterceptor } from 'src/interceptors/slugid.interceptor';
import { TaskResponseInterceptor } from 'src/interceptors/task.interceptor';
import { UUID } from 'crypto';
import { SlugIdPipe } from 'src/users/pipe/id.pipe';
import { UpdateResult } from 'typeorm';

@ApiTags('tasks')
@UseInterceptors(SlugIdInterceptor)
@Controller('tasks')
export class TasksController {
    constructor(
        private tasksService: TasksService
    ) {}

    @Post('/create')
    @ApiCreatedResponse({
        description: 'create task for user',
        type: Task
    })
    @ApiBearerAuth('JWT')
    async createTask(@Req() req, @Body() payload: createTaskDto): Promise<Task>{
        return await this.tasksService.createTask(slugid.decode(req.user.id), payload);
    }

    @Get('/me')
    @UseInterceptors(TaskResponseInterceptor)
    @ApiCreatedResponse({
        description: 'get all tasks by user',
        type: Promise<Task[]>
    })
    @ApiBearerAuth('JWT')
    async getAllTasks(@Req() req): Promise<Task[]>{
        return await this.tasksService.getAllTasks(slugid.decode(req.user.id))
    }

    @Patch('/:id')
    @UseInterceptors(TaskResponseInterceptor)
    @UsePipes(SlugIdPipe)
    @ApiCreatedResponse({
        description: 'update task by task id',
        type: Promise<UpdateResult>
    })
    @ApiBearerAuth('JWT')
    async updateTask(@Param('taskId') taskId:UUID, @Body() payload: updateTaskDto): Promise<UpdateResult>{
        return await this.tasksService.updateTask(taskId, payload)
    }

    @Delete('/:id')
    @UsePipes(SlugIdPipe)
    @ApiCreatedResponse({
        description: 'delete task by task id',
        type: Promise<{ affected?: number }>
    })
    @ApiBearerAuth('JWT')
    async deleteTask(@Param('taskId') taskId:UUID): Promise<{ affected?: number }> {
        return this.tasksService.deleteTask(taskId)
    }
}
