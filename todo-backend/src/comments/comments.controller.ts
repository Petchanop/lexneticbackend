import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { Comment } from './entities/comments.entity'
import { Roles } from 'src/users/decorator/roles.decorator';
import { UserRole } from 'src/users/entities/users.entity';
import { commentDto } from './dto/comments.dto';

@ApiTags('comments')
@Roles(UserRole.ADMIN, UserRole.USER)
@Controller('comments')
export class CommentsController {
    constructor(
        private commentService: CommentsService
    ) { }

    @Post('/create')
    @ApiCreatedResponse({
        description: 'create comments',
        type: Promise<Comment>
    })
    @ApiBearerAuth('JWT')
    async createComment(@Param('taskId') taskId: UUID, @Body() payload: commentDto) : Promise<Comment> {
        return await this.commentService.createComment(taskId, payload)
    }

    @Get('/me')
    @ApiResponse({
        status: 200,
        description: 'get user comment ',
        type: Promise<Comment[]>
    })
    @ApiNotFoundResponse({
        description: 'comment by user not found'
    })
    @ApiBearerAuth('JWT')
    async getCommentByUser(@Req() req): Promise<Comment[]> {
        const id = req.user.id
        return this.commentService.getCommentByUser(id)
    }

    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'get comment by comment id',
        type: Response
    })
    @ApiBearerAuth('JWT')
    async getCommentById(@Param('id') commentId: UUID, @Res() res: Response) : Promise<Response>{
        const result = await this.commentService.getCommentById(commentId)
        return res.status(HttpStatus.OK).send(result)
    }

    @Patch(':id')
    @ApiResponse({
        status: 204,
        description: 'update comment by id',
        type: Response
    })
    @ApiBearerAuth('JWT')
    async updateComment(@Param('id') commentId: UUID, @Body() payload: commentDto, @Res() res: Response) : Promise<Response> {
        try {
            await this.commentService.updateComment(commentId, payload)
        } catch (error) {
            throw new HttpException('Cannot update comment', HttpStatus.NOT_FOUND)
        }
        return res.status(HttpStatus.OK).send({status: HttpStatus.OK, message: `successful update comment id ${commentId}`})
    }

    @Delete(':id')
    @ApiNoContentResponse({
        description: 'delete comment by id',
        type: Response
    })
    @ApiBearerAuth('JWT')
    async deleteCommentById(@Param('id') commentId: UUID, @Res() res:Response) : Promise<Response> {
        await this.commentService.deleteComment(commentId)
        return res.status(HttpStatus.NO_CONTENT).send()
    }

}
