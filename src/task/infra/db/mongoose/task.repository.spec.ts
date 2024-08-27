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

  it('should find all tasks for a user', async () => {
    const mockTasks = [{ id: '1', userId: 'user1', title: 'Task One' }];
    (taskModel.find as jest.Mock).mockResolvedValue(mockTasks);

    const tasks = await repository.findAll('user1');
    expect(tasks).toEqual(mockTasks);
    expect(taskModel.find).toHaveBeenCalledWith({ userId: 'user1' });
  });

  it('should find a task by id', async () => {
    const mockTask = { id: '1', userId: 'user1', title: 'Task One' };
    (taskModel.findOne as jest.Mock).mockResolvedValue(mockTask);

    const task = await repository.findById('1');
    expect(task).toEqual(mockTask);
    expect(taskModel.findOne).toHaveBeenCalledWith({ _id: '1' });
  });

  it('should create a new task', async () => {
    const mockTask = {
      id: '1',
      userId: 'user1',
      title: 'Task One',
      toJSON: jest.fn(),
    };
    (taskModel.create as jest.Mock).mockResolvedValue(mockTask);

    const entity = new Task({
      id: '1',
      userId: 'user1',
      title: 'Task One',
      description: 'Task one ',
      status: STATUS.PENDING,
    });
    await repository.create(entity);

    expect(taskModel.create).toHaveBeenCalledWith(entity.toJSON());
  });

  it('should update an existing task', async () => {
    const mockTask = {
      id: '1',
      userId: 'user1',
      title: 'Task Updated',
      toJSON: jest.fn(),
    };
    (taskModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockTask);

    const entity = new Task({
      id: '1',
      userId: 'user1',
      title: 'Task Updated',
      description: 'Task one ',
      status: STATUS.PENDING,
    });
    await repository.update(entity);

    expect(taskModel.findByIdAndUpdate).toHaveBeenCalledWith(
      entity.id,
      entity.toJSON(),
      {
        new: true,
      },
    );
  });

  it('should delete a task by id', async () => {
    (taskModel.deleteOne as jest.Mock).mockResolvedValue({});

    await repository.delete('1');
    expect(taskModel.deleteOne).toHaveBeenCalledWith({ _id: '1' });
  });
});
