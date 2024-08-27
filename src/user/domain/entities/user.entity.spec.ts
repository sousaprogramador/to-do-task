import { User } from './user.entity';

describe('User Unit Tests', () => {
  test('constructor of user', () => {
    const user = new User({
      name: 'Matews',
      email: 'matews@devok.com.br',
      password: 'secret',
    });

    expect(user.props).toStrictEqual({
      name: 'Matews',
      email: 'matews@devok.com.br',
      password: 'secret',
    });
  });

  test('getter and setter of name prop', () => {
    const user = new User({
      name: 'Matews',
      email: 'matews@devok.com.br',
      password: 'secret',
    });
    expect(user.name).toBe('Matews');

    user['name'] = 'Paul Due';
    expect(user.name).toBe('Paul Due');
  });
});
