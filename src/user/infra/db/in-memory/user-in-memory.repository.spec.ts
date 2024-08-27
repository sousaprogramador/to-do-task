import { User } from '../../../domain';
import { UserInMemoryRepositoryRepository } from './user-in-memory.repository';

describe('UserInMemoryRepositoryRepository', () => {
  let repository: UserInMemoryRepositoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepositoryRepository();
  });

  it('should create a new user', async () => {
    const user = new User({
      id: '1',
      name: 'User',
      email: 'test@example.com',
      password: 'secret',
    });
    await repository.create(user);

    const foundUser = await repository.findById('1');
    expect(foundUser).toEqual(user);
  });

  it('should find all users', async () => {
    const user1 = new User({
      id: '1',
      name: 'User One',
      email: 'test1@example.com',
      password: 'secret1',
    });
    const user2 = new User({
      id: '2',
      name: 'User Two',
      email: 'test2@example.com',
      password: 'secret2',
    });

    await repository.create(user1);
    await repository.create(user2);

    const users = await repository.findAll();
    expect(users).toEqual([user1, user2]);
  });

  it('should find a user by id', async () => {
    const user = new User({
      id: '1',
      name: 'User One',
      email: 'test1@example.com',
      password: 'secret1',
    });
    await repository.create(user);

    const foundUser = await repository.findById('1');
    expect(foundUser).toEqual(user);
  });

  it('should find a user by email', async () => {
    const user = new User({
      id: '1',
      name: 'User One',
      email: 'test@example.com',
      password: 'secret1',
    });
    await repository.create(user);

    const foundUser = await repository.findByEmail('test@example.com');
    expect(foundUser).toEqual(user);
  });

  it('should update a user', async () => {
    const user = new User({
      id: '1',
      name: 'User One',
      email: 'test1@example.com',
      password: 'secret1',
    });
    await repository.create(user);

    const updatedUser = new User({
      id: '1',
      name: 'User updated',
      email: 'updated@example.com',
      password: 'secret1',
    });
    await repository.update(updatedUser);

    const foundUser = await repository.findById('1');
    expect(foundUser).toEqual(updatedUser);
  });

  it('should delete a user', async () => {
    const user = new User({
      id: '1',
      name: 'User One',
      email: 'test1@example.com',
      password: 'secret1',
    });
    await repository.create(user);

    await repository.delete('1');
    const foundUser = await repository.findById('1');
    expect(foundUser).toBeUndefined();
  });
});
