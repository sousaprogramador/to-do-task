import { UseCase as DefaultUseCase } from '../../../common';
import { UserRepository } from '../../domain';
import { UserOutputMapper, UserOutput } from '../dto/user.output';

export namespace GetUserUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepo: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepo.findByEmail(input.email);
      return UserOutputMapper.toOutput(entity);
    }
  }

  export type Input = {
    email: string;
  };

  export type Output = UserOutput;
}

export default GetUserUseCase;
