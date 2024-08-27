import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../db/mongoose';
import { UserController } from './user.controller';
import { USER_PROVIDERS } from './user.provider';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    USER_PROVIDERS.REPOSITORIES.USER_MONGOOSE_REPOSITORY,
    ...Object.values(USER_PROVIDERS.USE_CASES),
  ],
})
export class UserModule {}
