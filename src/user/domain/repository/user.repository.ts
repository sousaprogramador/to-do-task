import { User } from '../entities';

export interface UserRepositoryInterface {
  findAll: () => Promise<User[]>;
  findById: (userId: string) => Promise<User>;
  findByEmail: (email: string) => Promise<User>;
  create: (entity: User) => Promise<void>;
  update: (data: User) => Promise<void | string>;
  delete: (id: string) => Promise<void>;
}

export namespace UserRepository {
  export type Repository = UserRepositoryInterface;
}

export default UserRepository;
