import { UseCase as DefaultUseCase } from '../../../common';
import { User } from '../../domain/entities';
import { UserRepository } from '../../domain';
import { UserOutputMapper } from '../dto/user.output';

export namespace CreateUserUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private UserRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = new User(input);
      await this.UserRepository.create(entity);
      return UserOutputMapper.toOutput(entity);
    }
  }

  export type Input = {
    name: string;
    email: string;
    password: string;
  };

  export type Output = any;
}
export default CreateUserUseCase;
