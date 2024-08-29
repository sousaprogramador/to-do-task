import { UseCase as DefaultUseCase } from '../../../common';
import { TaskRepository } from '../../domain/repository/task.repository';
import { TaskOutputMapper, TaskOutput } from '../dto/task.output';

export namespace ListTasksUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private taskRepo: TaskRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      if (!input.userId || typeof input.userId !== 'string') {
        throw new Error('Invalid user ID.');
      }

      try {
        const tasks = await this.taskRepo.findAll(input.userId);
        if (!tasks.length) {
          return [];
        }
        return tasks.map((task) => TaskOutputMapper.toOutput(task));
      } catch (error) {
        throw new Error(
          'An error occurred while retrieving tasks: ' + error.message,
        );
      }
    }
  }

  export type Input = {
    userId: string;
  };

  export type Output = TaskOutput[];
}

export default ListTasksUseCase;
