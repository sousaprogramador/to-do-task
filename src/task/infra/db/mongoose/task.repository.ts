import { Model } from 'mongoose';
import { Task } from '../../../domain/entities';
import { TaskRepository as TaskRepositoryContract } from '../../../domain/repository/task.repository';
import { TaskDocument } from './task.model';

export class TaskMongooseRepository
  implements TaskRepositoryContract.Repository
{
  constructor(private taskRepository: typeof Model<TaskDocument>) {}

  async findAll(userId: string): Promise<Task[]> {
    return this.taskRepository.find({ userId });
  }

  async findById(id: string): Promise<Task> {
    try {
      return await this.taskRepository.findOne({ _id: id });
    } catch {}
  }

  async create(entity: Task): Promise<void> {
    await this.taskRepository.create(entity.toJSON());
  }

  async update(entity: Task): Promise<void> {
    await this.taskRepository.findByIdAndUpdate(entity.id, entity.toJSON(), {
      new: true,
    });
  }

  async delete(id: string): Promise<void> {
    try {
      await this.taskRepository.deleteOne({ _id: id });
    } catch {}
  }
}
