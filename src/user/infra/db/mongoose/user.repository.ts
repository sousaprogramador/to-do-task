import { Model } from 'mongoose';
import {
  User,
  UserRepository as UserRepositoryContract,
} from '../../../domain';
import { UserDocument } from './user.model';

export class UserMongooseRepository
  implements UserRepositoryContract.Repository
{
  constructor(private userRepository: typeof Model<UserDocument>) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOne({ _id: id });
    } catch {}
  }

  async findByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOne({ email: email });
    } catch {}
  }

  async create(entity: User): Promise<void> {
    await this.userRepository.create(entity.toJSON());
  }

  async update(entity: User): Promise<void> {
    await this.userRepository.findByIdAndUpdate(entity.id, entity.toJSON(), {
      new: true,
    });
  }

  async delete(id: string): Promise<void> {
    try {
      await this.userRepository.deleteOne({ _id: id });
    } catch {}
  }
}
