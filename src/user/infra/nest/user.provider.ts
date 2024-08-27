import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserUseCase } from '../../application/use-cases';
import { UserRepository } from '../../domain';
import { User, UserDocument, UserMongooseRepository } from '../db/mongoose';

export namespace USER_PROVIDERS {
  export namespace REPOSITORIES {
    export const USER_MONGOOSE_REPOSITORY = {
      provide: 'UserMongooseRepository',
      useFactory: (userModel: typeof Model<UserDocument>) => {
        return new UserMongooseRepository(userModel);
      },
      inject: [getModelToken(User.name)],
    };

    export const USER_REPOSITORY = {
      provide: 'UserMongooseRepository',
      useExisting: 'UserMongooseRepository',
    };
  }

  export namespace USE_CASES {
    export const CREATE_USER_USE_CASE = {
      provide: CreateUserUseCase.UseCase,
      useFactory: (userRepo: UserRepository.Repository) => {
        return new CreateUserUseCase.UseCase(userRepo);
      },
      inject: [REPOSITORIES.USER_REPOSITORY.provide],
    };
  }
}
