import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TaskController } from '../src/task/infra/nest/task.controller';
import {
  CreateTaskUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  GetTaskUseCase,
  ListTasksUseCase,
} from '../src/task/application/use-cases';
import { JwtAuthGuard } from '../src/auth/jwt/jwt.guard';
import { AppModule } from '../src/app.module';

describe('TaskController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 10000);

  afterAll(async () => {
    await app.close();
  });

  const mockListTasksUseCase = {
    execute: jest.fn(),
  };
  const mockGetTaskUseCase = {
    execute: jest.fn(),
  };
  const mockCreateTaskUseCase = {
    execute: jest.fn(),
  };
  const mockUpdateTaskUseCase = {
    execute: jest.fn(),
  };
  const mockDeleteTaskUseCase = {
    execute: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: ListTasksUseCase.UseCase,
          useValue: mockListTasksUseCase,
        },
        {
          provide: GetTaskUseCase.UseCase,
          useValue: mockGetTaskUseCase,
        },
        {
          provide: CreateTaskUseCase.UseCase,
          useValue: mockCreateTaskUseCase,
        },
        {
          provide: UpdateTaskUseCase.UseCase,
          useValue: mockUpdateTaskUseCase,
        },
        {
          provide: DeleteTaskUseCase.UseCase,
          useValue: mockDeleteTaskUseCase,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true), // Mock do guard JWT
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/GET task', () => {
    const taskOutputs = [
      {
        id: '1',
        title: 'Test Task 1',
        description: 'Test Description 1',
        status: 'pending',
      },
    ];
    mockListTasksUseCase.execute.mockResolvedValue(taskOutputs);

    return request(app.getHttpServer())
      .get('/task')
      .expect(200)
      .expect(taskOutputs);
  });

  it('/GET task/:id', () => {
    const taskOutput = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      status: 'pending',
    };
    mockGetTaskUseCase.execute.mockResolvedValue(taskOutput);

    return request(app.getHttpServer())
      .get('/task/1')
      .expect(200)
      .expect(TaskController.TaskPresenterToResponse(taskOutput));
  });

  it('/POST task', () => {
    const createTaskDto = {
      title: 'New Task',
      description: 'New Task Description',
      status: 'pending',
    };
    const taskOutput = {
      id: '1',
      ...createTaskDto,
    };

    mockCreateTaskUseCase.execute.mockResolvedValue(taskOutput);

    return request(app.getHttpServer())
      .post('/task')
      .send(createTaskDto)
      .expect(201)
      .expect(TaskController.TaskPresenterToResponse(taskOutput));
  });

  it('/PUT task/:id', () => {
    const updateTaskDto = {
      title: 'Updated Task',
      description: 'Updated Description',
      status: 'completed',
    };
    const taskOutput = {
      id: '1',
      ...updateTaskDto,
    };

    mockUpdateTaskUseCase.execute.mockResolvedValue(taskOutput);

    return request(app.getHttpServer())
      .put('/task/1')
      .send(updateTaskDto)
      .expect(200)
      .expect(TaskController.TaskPresenterToResponse(taskOutput));
  });

  it('/DELETE task/:id', () => {
    mockDeleteTaskUseCase.execute.mockResolvedValue(undefined);

    return request(app.getHttpServer()).delete('/task/1').expect(204);
  });
});
