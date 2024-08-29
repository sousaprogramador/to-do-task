import { UseCase as DefaultUseCase } from '../../../common';
import { TaskRepository } from '../../domain/repository/task.repository';
import { TaskOutputMapper, TaskOutput } from '../dto/task.output';

export namespace GetTaskUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private taskRepo: TaskRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      if (!input.id) {
        throw new Error('Invalid task ID provided');
      }

      const entity = await this.taskRepo.findById(input.id);
      if (!entity) {
        throw new Error('Task not found');
      }

      return TaskOutputMapper.toOutput(entity);
    }
  }

  export type Input = {
    id: string;
  };

  export type Output = TaskOutput;
}

export default GetTaskUseCase;
