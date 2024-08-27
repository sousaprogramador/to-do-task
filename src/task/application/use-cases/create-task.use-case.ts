import { UseCase as DefaultUseCase } from '../../../common';
import { TaskRepository } from '../../domain/repository/task.repository';
import { Task, STATUS } from '../../domain/entities';
import { TaskOutputMapper, TaskOutput } from '../dto/task.output';

export namespace CreateTaskUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private taskRepository: TaskRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = new Task(input);
      await this.taskRepository.create(entity);
      return TaskOutputMapper.toOutput(entity);
    }
  }

  export type Input = {
    title: string;
    description: string;
    image?: string;
    userId?: string;
    status: STATUS;
  };

  export type Output = TaskOutput;
}

export default CreateTaskUseCase;
