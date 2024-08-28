import { Task } from '../../../domain/entities';
import { TaskInMemoryRepository } from './task-in-memory.repository';

describe('TaskInMemoryRepository', () => {
  let repository: TaskInMemoryRepository;

  beforeEach(() => {
    repository = new TaskInMemoryRepository();
    repository.items = [
      new Task({
        id: '1',
        title: 'Task 1',
        description: 'Desc 1',
        userId: 'user1',
        status: 'pendente',
      }),
      new Task({
        id: '2',
        title: 'Task 2',
        description: 'Desc 2',
        userId: 'user1',
        status: 'pendente',
      }),
      new Task({
        id: '3',
        title: 'Task 3',
        description: 'Desc 3',
        userId: 'user2',
        status: 'pendente',
      }),
    ];
  });

  it('should find all tasks for a user', async () => {
    const tasks = await repository.findAll('user1');
    expect(tasks).toHaveLength(3);
    expect(tasks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: '1' }),
        expect.objectContaining({ id: '2' }),
      ]),
    );
  });

  it('should find a task by id', async () => {
    const task = await repository.findById('1');
    expect(task).toBeDefined();
    expect(task.id).toBe('1');
  });

  it('should create a new task', async () => {
    const newTask = new Task({
      id: '4',
      title: 'Task 4',
      description: 'Desc 4',
      userId: 'user3',
      status: 'pendente',
    });
    await repository.create(newTask);

    const task = await repository.findById('4');
    expect(task).toBeDefined();
    expect(task.title).toBe('Task 4');
  });

  it('should update a task', async () => {
    const taskToUpdate = new Task({
      id: '1',
      title: 'Updated Task 1',
      description: 'Updated Desc 1',
      userId: 'user1',
      status: 'pendente',
    });
    await repository.update(taskToUpdate);

    const updatedTask = await repository.findById('1');
    expect(updatedTask).toBeDefined();
    expect(updatedTask.title).toBe('Updated Task 1');
  });

  it('should delete a task', async () => {
    await repository.delete('1');
    const task = await repository.findById('1');
    expect(task).toBeUndefined();
  });
});
