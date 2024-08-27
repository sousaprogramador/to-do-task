import { UseCase as DefaultUseCase } from '../../../common';
import { TaskRepository } from '../../domain/repository/task.repository';
import { TaskOutputMapper, TaskOutput } from '../dto/task.output';

export namespace ListTasksUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private taskRepo: TaskRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const Tasks = await this.taskRepo.findAll(input.userId);
      return Tasks.map((task) => {
        return TaskOutputMapper.toOutput(task);
      });
    }
  }

  export type Input = {
    userId: string;
  };

  export type Output = TaskOutput[];
}

export default ListTasksUseCase;
