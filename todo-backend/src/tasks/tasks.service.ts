import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/tasks.entity';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { createTaskDto, updateTaskDto } from './dto/tasks.dto';
import { User } from 'src/users/entities/users.entity';
import { UUID } from 'crypto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
        private dataSource: DataSource,
    ) { }

    async createTask(userId: string, payload: createTaskDto): Promise<Task> {
        console.log(userId, payload)
        const get_task = await this.taskRepository.find({
            relations: {
                user: true
            },
            where: {
                user: {
                    id: userId
                }
            }
        });
        let user = await this.dataSource.getRepository(User).findOne({
            where: {
                id: userId
            }
        })
        const createTask = { ...payload }
        const task = new Task({
            ...createTask
        })
        task.user = user
        get_task.push(task);
        const res = await this.taskRepository.save(get_task);
        return task
    }

    async getAllTasks(userId: string): Promise<Task[]> {
        return await this.taskRepository.find({
            relations: {
                user: true
            },
            where: {
                user: {
                    id: userId
                }
            }
        });
    }

    async updateTask(taskId: UUID, payload: updateTaskDto): Promise<UpdateResult> {
        const updated = await this.taskRepository.update(taskId, payload)
        return updated
    }

    async deleteTask(taskId: UUID): Promise<{ affected?: number }> {
        return this.taskRepository.delete(taskId)
    }
}
