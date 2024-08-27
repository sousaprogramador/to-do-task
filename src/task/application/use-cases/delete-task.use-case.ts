import { UseCase as DefaultUseCase } from '../../../common';
import { TaskRepository } from '../../domain/repository/task.repository';

export namespace DeleteTaskUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private taskRepository: TaskRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      await this.taskRepository.delete(input.id);
    }
  }

  export type Input = {
    id: string;
  };

  type Output = void;
}

export default DeleteTaskUseCase;
