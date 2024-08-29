import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import {
  CreateTaskUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  GetTaskUseCase,
  ListTasksUseCase,
} from '../../application/use-cases';
import { TaskOutput } from '../../application/dto/task.output';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TaskController', () => {
  let controller: TaskController;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should return a list of tasks for the authenticated user', async () => {
    const taskOutput: TaskOutput[] = [
      {
        id: '1',
        title: 'Test Task 1',
        description: 'Test Description 1',
        status: 'pending',
        image: '',
      },
      {
        id: '2',
        title: 'Test Task 2',
        description: 'Test Description 2',
        status: 'completed',
        image: '',
      },
    ];

    mockListTasksUseCase.execute.mockResolvedValue(taskOutput);

    const req = { user: { id: 'user123' } };
    const result = await controller.search(req);

    expect(result).toEqual(taskOutput);
    expect(mockListTasksUseCase.execute).toHaveBeenCalledWith({
      userId: 'user123',
    });
  });

  it('should return a task when found', async () => {
    const taskOutput: TaskOutput = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      status: 'pending',
    };

    mockGetTaskUseCase.execute.mockResolvedValue(taskOutput);

    const result = await controller.findOne('1');
    expect(result).toEqual(TaskController.TaskPresenterToResponse(taskOutput));
    expect(mockGetTaskUseCase.execute).toHaveBeenCalledWith({ id: '1' });
  });

  it('should throw NotFoundException if the task is not found', async () => {
    mockGetTaskUseCase.execute.mockResolvedValue(null);

    await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    expect(mockGetTaskUseCase.execute).toHaveBeenCalledWith({ id: '1' });
  });

  it('should create a new task', async () => {
    const taskOutput: TaskOutput = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      status: 'pending',
    };

    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test Description',
      status: 'pending',
    };

    const req = { user: { id: 'user123' } };

    mockCreateTaskUseCase.execute.mockResolvedValue(taskOutput);

    const result = await controller.create(createTaskDto, req);
    expect(result).toEqual(TaskController.TaskPresenterToResponse(taskOutput));
    expect(mockCreateTaskUseCase.execute).toHaveBeenCalledWith({
      ...createTaskDto,
      user: req.user,
    });
  });

  it('should update an existing task', async () => {
    const taskOutput: TaskOutput = {
      id: '1',
      title: 'Updated Task',
      description: 'Updated Description',
      status: 'completed',
    };

    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated Task',
      description: 'Updated Description',
      status: 'completed',
    };

    mockUpdateTaskUseCase.execute.mockResolvedValue(taskOutput);

    const result = await controller.update('1', updateTaskDto);
    expect(result).toEqual(TaskController.TaskPresenterToResponse(taskOutput));
    expect(mockUpdateTaskUseCase.execute).toHaveBeenCalledWith({
      id: '1',
      ...updateTaskDto,
    });
  });

  it('should delete a task successfully', async () => {
    mockDeleteTaskUseCase.execute.mockResolvedValue(undefined);

    await expect(controller.remove('1')).resolves.toBeUndefined();
    expect(mockDeleteTaskUseCase.execute).toHaveBeenCalledWith({ id: '1' });
  });
});
