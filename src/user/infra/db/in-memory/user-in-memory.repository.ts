import {
  User,
  UserRepository as UserRepositoryContract,
} from '../../../domain';

export class UserInMemoryRepositoryRepository
  implements UserRepositoryContract.Repository
{
  items: User[] = [];

  async findAll(): Promise<User[]> {
    return this.items;
  }

  async findById(id: string): Promise<User> {
    const User = this.items.find((i) => i.id === id);
    return User;
  }

  async findByEmail(email: string): Promise<User> {
    const User = this.items.find((i) => i.email === email);
    return User;
  }

  async create(entity: User): Promise<void> {
    this.items.push(entity);
  }

  async update(entity: User): Promise<string | void> {
    const indexFound = this.items.findIndex((i) => i.id === entity.id);
    this.items[indexFound] = entity;
  }

  async delete(id: string): Promise<void> {
    const indexFound = this.items.findIndex((i) => i.id === id);
    this.items.splice(indexFound, 1);
  }
}
