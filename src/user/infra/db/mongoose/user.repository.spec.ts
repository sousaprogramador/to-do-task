import { Model } from 'mongoose';
import { User } from '../../../domain';
import { UserMongooseRepository } from './user.repository';
import { UserDocument } from './user.model';

jest.mock('mongoose', () => ({
  Model: jest.fn().mockImplementation(() => ({
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    deleteOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  })),
}));

describe('UserMongooseRepository', () => {
  let repository: UserMongooseRepository;
  let userModel: Model<UserDocument>;

  beforeEach(() => {
    userModel = new Model<UserDocument>();
    repository = new UserMongooseRepository(userModel);
  });

  it('should find all users', async () => {
    const mockUsers = [
      { _id: '1', email: 'user1@example.com', name: 'User One' },
    ];
    (userModel.find as jest.Mock).mockResolvedValue(mockUsers);

    const users = await repository.findAll();
    expect(users).toEqual(mockUsers);
    expect(userModel.find).toHaveBeenCalledTimes(1);
  });

  it('should find a user by id', async () => {
    const mockUser = { _id: '1', email: 'user1@example.com', name: 'User One' };
    (userModel.findOne as jest.Mock).mockResolvedValue(mockUser);

    const user = await repository.findById('1');
    expect(user).toEqual(mockUser);
    expect(userModel.findOne).toHaveBeenCalledWith({ _id: '1' });
  });

  it('should find a user by email', async () => {
    const mockUser = { _id: '1', email: 'user1@example.com', name: 'User One' };
    (userModel.findOne as jest.Mock).mockResolvedValue(mockUser);

    const user = await repository.findByEmail('user1@example.com');
    expect(user).toEqual(mockUser);
    expect(userModel.findOne).toHaveBeenCalledWith({
      email: 'user1@example.com',
    });
  });

  it('should update an existing user', async () => {
    const mockUser = {
      id: '1',
      email: 'user1@example.com',
      name: 'User One',
      toJSON: jest.fn(),
    };
    (userModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUser);

    const entity = new User({
      _id: '1',
      email: 'user1@example.com',
      name: 'User One',
      password: 'secret',
    });
    await repository.update(entity);

    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
      entity._id,
      entity.toJSON(),
      {
        new: true,
      },
    );
  });

  it('should delete a user by id', async () => {
    (userModel.deleteOne as jest.Mock).mockResolvedValue({});

    await repository.delete('1');
    expect(userModel.deleteOne).toHaveBeenCalledWith({ _id: '1' });
  });
});
