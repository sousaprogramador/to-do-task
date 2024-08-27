import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/infra/db/mongoose';
import { AuthController } from './auth.controller';
import { AUTH_PROVIDERS } from './auth.provider';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    ...Object.values(AUTH_PROVIDERS.USE_CASES),
    AUTH_PROVIDERS.REPOSITORIES.USER_MONGOOSE_REPOSITORY,
    AUTH_PROVIDERS.REPOSITORIES.ACCESS_TOKEN_STRATEGY_REPOSITORY,
    AUTH_PROVIDERS.REPOSITORIES.REFRESH_TOKEN_STRATEGY_REPOSITORY,
  ],
})
export class AuthModule {}
