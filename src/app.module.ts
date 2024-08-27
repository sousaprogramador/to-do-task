import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/infra/nest/user.module';
import { TaskModule } from './task/infra/nest/task.module';

dotenv.config();
const uri = process.env.DATABASE_CONNECTION;
@Module({
  imports: [MongooseModule.forRoot(uri, {}), UserModule, TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
