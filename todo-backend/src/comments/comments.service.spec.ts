import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { DataSource, Repository } from 'typeorm';
import { Comment } from './entities/comments.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { dataSourceMockFactory } from 'src/users/users.service.spec';

export const mockCommentRepository = {}

describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        DataSource,
        Repository,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository,
        },
        {
          provide: DataSource, 
          useValue: dataSourceMockFactory,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
