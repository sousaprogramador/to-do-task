import { TaskOutput } from 'src/task/application/dto/task.output';

export class TaskPresenter {
  id: string;
  title: string;
  description: string;
  image: string;
  user?: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
  status: string;

  constructor(output: TaskOutput) {
    this.id = output.id;
    this.title = output.title;
    this.description = output.description;
    this.image = output.image;
    this.user = output.user;
    this.status = output.status;
  }
}

export class TaskPresenterCollectionPresenter {
  data: TaskPresenter[];
}
