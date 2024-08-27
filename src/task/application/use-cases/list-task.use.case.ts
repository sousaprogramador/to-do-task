import { UseCase as DefaultUseCase } from '../../../common';
import { TaskRepository } from '../../domain/repository/task.repository';
import { TaskOutputMapper, TaskOutput } from '../dto/task.output';

export namespace ListTasksUseCase {
  export class UseCase implements DefaultUseCase<void, Output> {
    constructor(private taskRepo: TaskRepository.Repository) {}

    async execute(): Promise<Output> {
      const Tasks = await this.taskRepo.findAll('');
      return Tasks.map((task) => {
        return TaskOutputMapper.toOutput(task);
      });
    }
  }

  export type Output = TaskOutput[];
}

export default ListTasksUseCase;
