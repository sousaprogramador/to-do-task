import { Task, STATUS } from './task.entitiy';

describe('Task Unit Tests', () => {
  test('constructor of task peending', () => {
    const task = new Task({
      title: 'to do list',
      description: 'test a to do list',
      image: 'image.com.br',
      userId: '123',
      status: STATUS.PENDING,
    });

    expect(task.props).toStrictEqual({
      title: 'to do list',
      description: 'test a to do list',
      image: 'image.com.br',
      userId: '123',
      status: STATUS.PENDING,
    });
  });

  test('constructor of task canceled', () => {
    const task = new Task({
      title: 'to do list',
      description: 'test a to do list',
      image: 'image.com.br',
      userId: '123',
      status: STATUS.CANCELED,
    });

    expect(task.props).toStrictEqual({
      title: 'to do list',
      description: 'test a to do list',
      image: 'image.com.br',
      userId: '123',
      status: STATUS.CANCELED,
    });
  });
});
