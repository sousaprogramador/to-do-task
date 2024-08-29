import { GetTaskUseCase } from '../get-task.use-case';
import { TaskInMemoryRepository } from '../../../infra/db/in-memory';
import { Task } from '../../../domain/entities';

describe('GetTaskUseCase', () => {
  let useCase: GetTaskUseCase.UseCase;
  let mockTaskRepository: TaskInMemoryRepository;

  beforeEach(() => {
    mockTaskRepository = new TaskInMemoryRepository();
    useCase = new GetTaskUseCase.UseCase(mockTaskRepository);
  });

  it('should retrieve a task successfully', async () => {
    const input: GetTaskUseCase.Input = { id: '1' };
    mockTaskRepository.create(
      new Task({
        id: '1',
        title: 'Task Title',
        description: 'Task Description',
        status: 'peending',
      }),
    );

    const output = await useCase.execute(input);
    expect(output).toBeDefined();
    expect(output.id).toBe('1');
  });

  it('should throw if the task ID is not provided', async () => {
    const input: GetTaskUseCase.Input = { id: '' };
    await expect(useCase.execute(input)).rejects.toThrow(
      'Invalid task ID provided',
    );
  });

  it('should throw if the task is not found', async () => {
    mockTaskRepository.findById = jest.fn().mockResolvedValue(null);
    const input: GetTaskUseCase.Input = { id: '2' };
    await expect(useCase.execute(input)).rejects.toThrow('Task not found');
  });
});
