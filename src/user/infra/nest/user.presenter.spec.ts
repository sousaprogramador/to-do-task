import { UserPresenter } from './user.presenter';
import { UserOutput } from '../../application/dto/user.output';

describe('UserPresenter', () => {
  it('should correctly map UserOutput to UserPresenter', () => {
    const userOutput: UserOutput = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '',
    };

    const presenter = new UserPresenter(userOutput);

    expect(presenter.name).toBe(userOutput.name);
    expect(presenter.email).toBe(userOutput.email);
  });

  it('should handle missing optional fields', () => {
    const userOutput: UserOutput = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '',
    };

    const presenter = new UserPresenter(userOutput);

    expect(presenter.name).toBe(userOutput.name);
    expect(presenter.email).toBe(userOutput.email);
  });
});
