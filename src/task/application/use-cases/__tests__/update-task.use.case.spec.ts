import { UpdateTaskUseCase } from '../update-task.use.case';
import { TaskInMemoryRepository } from '../../../infra/db/in-memory';
import { Task } from '../../../domain/entities';

describe('UpdateTaskUseCase', () => {
  let useCase: UpdateTaskUseCase.UseCase;
  let mockTaskRepository: TaskInMemoryRepository;

  beforeEach(() => {
    mockTaskRepository = new TaskInMemoryRepository();
    useCase = new UpdateTaskUseCase.UseCase(mockTaskRepository);
  });

  it('should update a task successfully', async () => {
    mockTaskRepository.create(
      new Task({
        id: '1',
        title: 'Test Task',
        description: 'Description here',
        status: 'peending',
      }),
    );
    const input = {
      id: '1',
      title: 'Updated Title',
      description: 'Updated Description',
      status: 'completed',
    };

    const result = await useCase.execute(input);
    expect(result).toEqual({
      id: '1',
      title: 'Updated Title',
      description: 'Updated Description',
      status: 'completed',
    });
  });

  it('should throw if the task does not exist', async () => {
    const input = {
      id: 'non-existent-id',
      title: 'Updated Title',
      description: 'Updated Description',
      status: 'completed',
    };

    await expect(useCase.execute(input)).rejects.toThrow('Task not found');
  });

  it('should throw if required fields are missing', async () => {
    const input = {
      id: '1',
      title: '',
      description: 'Updated Description',
      status: 'completed',
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      'Missing required fields: id, title, description, or status',
    );
  });
});
