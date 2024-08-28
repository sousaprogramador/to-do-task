import { UseCase as DefaultUseCase } from '../../../common';
import { TaskRepository } from '../../domain/repository/task.repository';
import { TaskOutputMapper, TaskOutput } from '../dto/task.output';

export namespace UpdateTaskUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private taskRepo: TaskRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.taskRepo.findById(input.id);

      entity.update(input);

      await this.taskRepo.update(entity);

      return TaskOutputMapper.toOutput(entity);
    }
  }

  export type Input = {
    id: string;
    title: string;
    description: string;
    image?: string;
    userId?: string;
    status: string;
  };

  export type Output = TaskOutput;
}

export default UpdateTaskUseCase;
