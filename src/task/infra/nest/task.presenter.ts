import { TaskOutput } from 'src/task/application/dto/task.output';
import { ListTasksUseCase } from 'src/task/application/use-cases';
import { STATUS } from 'src/task/domain/entities';

export class TaskPresenter {
  id: string;
  title: string;
  description: string;
  image: string;
  userId?: string;
  status: STATUS;

  constructor(output: TaskOutput) {
    this.id = output.id;
    this.title = output.title;
    this.description = output.description;
    this.image = output.image;
    this.userId = output.userId;
    this.status = output.status;
  }
}

export class TaskPresenterCollectionPresenter {
  data: TaskPresenter[];
}
