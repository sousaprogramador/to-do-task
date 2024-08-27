import { Model } from 'mongoose';
import { STATUS, Task } from '../../../domain/entities';
import { TaskMongooseRepository } from './task.repository';
import { TaskDocument } from './task.model';

jest.mock('mongoose', () => ({
  Model: jest.fn().mockImplementation(() => ({
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
  })),
}));

describe('TaskMongooseRepository', () => {
  let repository: TaskMongooseRepository;
  let taskModel: typeof Model<TaskDocument>;

  beforeEach(() => {
    taskModel = new Model<TaskDocument>();
    repository = new TaskMongooseRepository(taskModel);
  });

  it('should create a new task', async () => {
    const mockTask = {
      id: '1',
      title: 'Task One',
      toJSON: jest.fn(),
    };
    (taskModel.create as jest.Mock).mockResolvedValue(mockTask);

    const entity = new Task({
      id: '1',
      title: 'Task One',
      description: 'Task one ',
      status: STATUS.PENDING,
    });
    await repository.create(entity);

    expect(taskModel.create).toHaveBeenCalledWith(entity.toJSON());
  });

  it('should delete a task by id', async () => {
    (taskModel.deleteOne as jest.Mock).mockResolvedValue({});

    await repository.delete('1');
    expect(taskModel.deleteOne).toHaveBeenCalledWith({ _id: '1' });
  });
});
