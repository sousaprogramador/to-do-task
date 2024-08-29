import { TaskPresenter } from './task.presenter';
import { TaskOutput } from '../../application/dto/task.output';

describe('TaskPresenter', () => {
  it('should correctly map TaskOutput to TaskPresenter', () => {
    const taskOutput: TaskOutput = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      image: 'test-image.png',
      user: {
        id: 'user1',
        email: 'user@test.com',
        name: 'Test User',
        avatar: 'avatar.png',
      },
      status: 'pending',
    };

    const presenter = new TaskPresenter(taskOutput);

    expect(presenter.id).toBe(taskOutput.id);
    expect(presenter.title).toBe(taskOutput.title);
    expect(presenter.description).toBe(taskOutput.description);
    expect(presenter.image).toBe(taskOutput.image);
    expect(presenter.user).toEqual(taskOutput.user);
    expect(presenter.status).toBe(taskOutput.status);
  });

  it('should handle missing optional fields', () => {
    const taskOutput: TaskOutput = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      status: 'pending',
    };

    const presenter = new TaskPresenter(taskOutput);

    expect(presenter.id).toBe(taskOutput.id);
    expect(presenter.title).toBe(taskOutput.title);
    expect(presenter.description).toBe(taskOutput.description);
    expect(presenter.status).toBe(taskOutput.status);
  });
});
