import { Task, STATUS } from '../../domain/entities';

export type TaskOutput = {
  id: string;
  title: string;
  description: string;
  image: string;
  userId?: string;
  status: STATUS;
};

export class TaskOutputMapper {
  static toOutput(entity: Task): TaskOutput {
    return entity?.toJSON();
  }
}
