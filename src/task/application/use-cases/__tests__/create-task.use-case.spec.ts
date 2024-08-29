import { CreateTaskUseCase } from '../create-task.use-case';
import { TaskInMemoryRepository } from '../../../infra/db/in-memory';

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase.UseCase;
  let mockTaskRepository: TaskInMemoryRepository;

  beforeEach(() => {
    mockTaskRepository = new TaskInMemoryRepository();
    useCase = new CreateTaskUseCase.UseCase(mockTaskRepository);

    jest.restoreAllMocks();
  });

  it('should create a task successfully', async () => {
    const input: CreateTaskUseCase.Input = {
      title: 'New Task',
      description: 'Description of new task',
      status: 'pending',
    };

    const expectedOutput = {
      title: 'New Task',
      description: 'Description of new task',
      status: 'pending',
      user: undefined,
      image: undefined,
    };
    await expect(useCase.execute(input)).resolves.toEqual(expectedOutput);
  });
});
