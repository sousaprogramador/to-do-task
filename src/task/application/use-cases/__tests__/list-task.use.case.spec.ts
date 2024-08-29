import { ListTasksUseCase } from '../list-task.use.case';
import { TaskInMemoryRepository } from '../../../infra/db/in-memory';
import { Task } from '../../../domain/entities';

describe('ListTasksUseCase', () => {
  let useCase: ListTasksUseCase.UseCase;
  let mockTaskRepository: TaskInMemoryRepository;

  beforeEach(() => {
    mockTaskRepository = new TaskInMemoryRepository();
    useCase = new ListTasksUseCase.UseCase(mockTaskRepository);
  });

  it('should return an array of tasks for a valid user ID', async () => {
    mockTaskRepository.create(
      new Task({
        id: '1',
        title: 'Test Task',
        description: 'Description here',
        status: 'peending',
      }),
    );
    const input = { userId: 'user123' };

    const result = await useCase.execute(input);
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('id', '1');
  });

  it('should return an empty array when no tasks are found', async () => {
    const input = { userId: 'user123' };

    const result = await useCase.execute(input);
    expect(result).toHaveLength(0);
  });

  it('should throw an error for invalid user ID', async () => {
    const input = { userId: '' };
    await expect(useCase.execute(input)).rejects.toThrow('Invalid user ID.');
  });
});
