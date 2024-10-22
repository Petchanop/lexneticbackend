import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Req, Res, UseInterceptors, UsePipes } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { createTaskDto, updateTaskDto } from './dto/tasks.dto';
import { Task } from './entities/tasks.entity';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { SlugIdInterceptor } from 'src/interceptors/slugid.interceptor';
import { TaskResponseInterceptor } from 'src/interceptors/task.interceptor';
import { UUID } from 'crypto';
import { SlugIdPipe } from 'src/users/pipe/id.pipe';
import { Response } from 'express';
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
        return await this.tasksService.createTask(req.user.id, payload);
    }

    @Get('/me')
    @UseInterceptors(TaskResponseInterceptor)
    @ApiCreatedResponse({
        description: 'get all tasks by user',
        type: Promise<Task[]>
    })
    @ApiBearerAuth('JWT')
    async getAllTasks(@Req() req): Promise<Task[]>{
        return await this.tasksService.getAllTasks(req.user.id)
    }

    @Patch(':id')
    @UseInterceptors(TaskResponseInterceptor)
    @UsePipes(SlugIdPipe)
    @ApiCreatedResponse({
        status: 204,
        description: 'update task by task id',
        type: Response
    })
    @ApiBearerAuth('JWT')
    async updateTask(@Param('id') taskId:UUID, @Body() payload: updateTaskDto, @Res() res:Response): Promise<Response>{
        try {
            await this.tasksService.updateTask(taskId, payload)
        } catch (error) {
            throw new HttpException('Cannot update task', HttpStatus.NOT_FOUND)
        }
        return res.status(HttpStatus.OK).send({status: HttpStatus.OK, message: `successful update comment id ${taskId}`})
    }

    @Delete(':id')
    @UsePipes(SlugIdPipe)
    @ApiCreatedResponse({
        description: 'delete task by task id',
        type: Response
    })
    @ApiBearerAuth('JWT')
    async deleteTask(@Param('id') taskId:UUID, @Res() res:Response): Promise<Response> {
        await this.tasksService.deleteTask(taskId)
        return res.status(HttpStatus.NO_CONTENT).send()
    }
}
