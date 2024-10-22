import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { DataSource, Repository } from 'typeorm';
import { Task } from './entities/tasks.entity';
import { dataSourceMockFactory } from 'src/users/users.service.spec';
import { getRepositoryToken } from '@nestjs/typeorm';

export const mockTaskRepository = {}

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        DataSource,
        Repository,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: DataSource, 
          useValue: dataSourceMockFactory,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
