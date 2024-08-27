import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateUserUseCase,
  GetUserUseCase,
} from '../user/application/use-cases';
import GetTokensUseCase from './application/use-cases/get-tokens.use-case';
import { UserRepository } from '../user/domain';
import {
  User,
  UserDocument,
  UserMongooseRepository,
} from '../user/infra/db/mongoose';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

export namespace AUTH_PROVIDERS {
  export namespace REPOSITORIES {
    export const USER_MONGOOSE_REPOSITORY = {
      provide: 'UserMongooseRepository',
      useFactory: (userModel: typeof Model<UserDocument>) => {
        return new UserMongooseRepository(userModel);
      },
      inject: [getModelToken(User.name)],
    };

    export const ACCESS_TOKEN_STRATEGY_REPOSITORY = {
      provide: 'AccessTokenStrategy',
      useClass: AccessTokenStrategy,
    };

    export const REFRESH_TOKEN_STRATEGY_REPOSITORY = {
      provide: 'RefreshTokenStrategy',
      useClass: RefreshTokenStrategy,
    };

    export const LOGIN_REPOSITORY = {
      provide: 'AuthSequelizeRepository',
      useExisting: 'AuthSequelizeRepository',
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

    export const GET_USER_USE_CASE = {
      provide: GetUserUseCase.UseCase,
      useFactory: (userRepo: UserRepository.Repository) => {
        return new GetUserUseCase.UseCase(userRepo);
      },
      inject: [REPOSITORIES.USER_REPOSITORY.provide],
    };

    export const GET_TOKENS_USE_CASE = {
      provide: GetTokensUseCase.UseCase,
      inject: [REPOSITORIES.USER_REPOSITORY.provide],
      useFactory: () => {
        return new GetTokensUseCase.UseCase();
      },
    };
  }
}
