import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema, Task } from '../db/mongoose';
import { TASK_PROVIDERS } from './task.provider';
import { TaskController } from './task.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  controllers: [TaskController],
  providers: [
    TASK_PROVIDERS.REPOSITORIES.TASK_MONGOOSE_REPOSITORY,
    ...Object.values(TASK_PROVIDERS.USE_CASES),
  ],
})
export class TaskModule {}
