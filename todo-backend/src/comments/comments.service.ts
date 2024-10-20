import { HttpException, HttpStatus, Injectable,  Res} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Task } from 'src/tasks/entities/tasks.entity';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { Comment } from './entities/comments.entity'
import { commentDto } from './dto/comments.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private commentRespository: Repository<Comment>,
        private dataSource: DataSource
    ){}

    async createComment(taskId: UUID, payload: commentDto): Promise<Comment>{
        const get_comment = await this.commentRespository.find({
            relations: {
                task : true
            },
            where: {
                task: {
                    id: taskId
                }
            }
        })
        let task = await this.dataSource.getRepository(Task).findOne({
            where: {
                id : taskId
            }
        })
        const createComment = new Comment({
            ...payload
        })
        createComment.task = task
        get_comment.push(createComment)
        await this.commentRespository.save(get_comment);
        return createComment
    }

    async getCommentByUser(userId: string): Promise<Comment[]> {
        const comments = await this.dataSource
        .getRepository(Comment)
        .createQueryBuilder('comment')
        .innerJoinAndSelect('comment.task', 'task')
        .innerJoinAndSelect('task.user', 'user')
        .where('user.id = :userId', { userId })
        .getMany();
      return comments;
    }

    async getCommentById(commentId: UUID) : Promise<Comment>{
        const comment = await this.commentRespository.findOne({where : { id: commentId}})
        return comment
    }

    async updateComment(commentId: UUID, payload: commentDto) : Promise<UpdateResult> {
        const res = await this.commentRespository.update( commentId, payload)
        return res
    }

    async deleteComment(commentId: UUID) {
        await this.commentRespository.delete(commentId)
    }
}
