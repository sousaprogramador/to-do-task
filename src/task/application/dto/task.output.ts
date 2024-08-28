import { Task } from '../../domain/entities';

export type TaskOutput = {
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
};

export class TaskOutputMapper {
  static toOutput(entity: Task): TaskOutput {
    return entity?.toJSON();
  }
}
