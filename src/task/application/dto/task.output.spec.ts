import { Task } from '../../domain/entities';
import { TaskOutputMapper } from './task.output';

describe('TaskOutputMapper Unit Tests', () => {
  it('should convert a task in output', () => {
    const entity = new Task({
      title: 'to do list',
      description: 'test a to do list',
      image: 'image.com.br',
      userId: '123',
      status: 'pendente',
    });

    const spyToJSON = jest.spyOn(entity, 'toJSON');
    const output = TaskOutputMapper.toOutput(entity);
    expect(spyToJSON).toHaveBeenCalled();
    expect(output).toStrictEqual({
      title: 'to do list',
      description: 'test a to do list',
      image: 'image.com.br',
      userId: '123',
      status: 'pendente',
    });
  });
});
