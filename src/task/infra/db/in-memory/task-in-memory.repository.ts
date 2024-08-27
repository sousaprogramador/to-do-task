import { Task } from '../../../domain/entities';
import { TaskRepository as TaskMemoryRepositoryContract } from '../../../domain/repository/task.repository';

export class TaskInMemoryRepository
  implements TaskMemoryRepositoryContract.Repository
{
  items: Task[];

  async findAll(userId: string): Promise<Task[]> {
    const tasks = [];
    this.items.map((item) => {
      if (item.userId === userId) {
        tasks.push(item);
      }
    });
    return tasks;
  }

  async findById(id: string): Promise<Task> {
    const task = this.items.find((i) => i.id === id);
    return task;
  }

  async create(entity: Task): Promise<void> {
    this.items.push(entity);
  }

  async update(entity: Task): Promise<string | void> {
    const indexFound = this.items.findIndex((i) => i.id === entity.id);
    this.items[indexFound] = entity;
  }

  async delete(id: string): Promise<void> {
    const indexFound = this.items.findIndex((i) => i.id === id);
    this.items.splice(indexFound, 1);
  }
}
