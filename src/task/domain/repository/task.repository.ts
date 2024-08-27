import { Task } from '../entities';

export interface TaskRepositoryInterface {
  findAll: (userId: string) => Promise<Task[]>;
  findById: (id: string) => Promise<Task>;
  create: (entity: Task) => Promise<void>;
  update: (data: Task) => Promise<void | string>;
  delete: (id: string) => Promise<void>;
}

export namespace TaskRepository {
  export type Repository = TaskRepositoryInterface;
}

export default TaskRepository;
