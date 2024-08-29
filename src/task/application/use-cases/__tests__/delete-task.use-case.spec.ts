import { DeleteTaskUseCase } from '../delete-task.use-case';
import { TaskInMemoryRepository } from '../../../infra/db/in-memory';

describe('DeleteTaskUseCase', () => {
  let useCase: DeleteTaskUseCase.UseCase;
  let mockTaskRepository: TaskInMemoryRepository;

  beforeEach(() => {
    mockTaskRepository = new TaskInMemoryRepository();
    useCase = new DeleteTaskUseCase.UseCase(mockTaskRepository);

    jest.restoreAllMocks();
  });

  it('should delete a task successfully', async () => {
    const input: DeleteTaskUseCase.Input = { id: '1' };
    await expect(useCase.execute(input)).resolves.toBeUndefined();
  });
});
