import * as bcrypt from 'bcrypt';
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
    return await this.userRepository.findOne({ email });
  }

  async create(entity: User): Promise<void> {
    const userObject = {
      ...entity.toJSON(),
      password: await bcrypt.hash(entity.toJSON().password, 10),
    };
    delete userObject.id;
    await this.userRepository.create(userObject);
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
