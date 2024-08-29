import { UseCase as DefaultUseCase } from '../../../common';
import { User } from '../../domain/entities';
import { UserRepository } from '../../domain';
import { UserOutput, UserOutputMapper } from '../dto/user.output';

export namespace CreateUserUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      if (!input.name || !input.email || !input.password) {
        throw new Error('Missing required fields: name, email, password');
      }

      const existingUser = await this.userRepository.findByEmail(input.email);
      if (existingUser) {
        throw new Error('Email already in use');
      }

      const entity = new User(input);

      await this.userRepository.create(entity);

      return UserOutputMapper.toOutput(entity);
    }
  }

  export type Input = {
    name: string;
    email: string;
    password: string;
  };

  export type Output = UserOutput;
}

export default CreateUserUseCase;
