import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DataSource, Repository } from 'typeorm';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/users.entity';

export const mockUserRepository = {};
export const dataSourceMockFactory = {}

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        DataSource,
        Repository,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: DataSource, 
          useValue: dataSourceMockFactory,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
