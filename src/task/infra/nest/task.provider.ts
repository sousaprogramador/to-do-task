import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateTaskUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  GetTaskUseCase,
  ListTasksUseCase,
} from '../../application/use-cases';
import TaskRepository from '../../domain/repository/task.repository';
import { TaskDocument, Task, TaskMongooseRepository } from '../db/mongoose';

export namespace TASK_PROVIDERS {
  export namespace REPOSITORIES {
    export const TASK_MONGOOSE_REPOSITORY = {
      provide: 'TaskMongooseRepository',
      useFactory: (taskModel: typeof Model<TaskDocument>) => {
        return new TaskMongooseRepository(taskModel);
      },
      inject: [getModelToken(Task.name)],
    };

    export const TASK_REPOSITORY = {
      provide: 'TaskMongooseRepository',
      useExisting: 'TaskMongooseRepository',
    };
  }

  export namespace USE_CASES {
    export const CREATE_TASK_USE_CASE = {
      provide: CreateTaskUseCase.UseCase,
      useFactory: (taskRepo: TaskRepository.Repository) => {
        return new CreateTaskUseCase.UseCase(taskRepo);
      },
      inject: [REPOSITORIES.TASK_REPOSITORY.provide],
    };

    export const UPDATE_TASK_USE_CASE = {
      provide: UpdateTaskUseCase.UseCase,
      useFactory: (taskRepo: TaskRepository.Repository) => {
        return new UpdateTaskUseCase.UseCase(taskRepo);
      },
      inject: [REPOSITORIES.TASK_REPOSITORY.provide],
    };

    export const DELETE_TASK_USE_CASE = {
      provide: DeleteTaskUseCase.UseCase,
      useFactory: (taskRepo: TaskRepository.Repository) => {
        return new DeleteTaskUseCase.UseCase(taskRepo);
      },
      inject: [REPOSITORIES.TASK_REPOSITORY.provide],
    };

    export const GET_TASK_USE_CASE = {
      provide: GetTaskUseCase.UseCase,
      useFactory: (taskRepo: TaskRepository.Repository) => {
        return new GetTaskUseCase.UseCase(taskRepo);
      },
      inject: [REPOSITORIES.TASK_REPOSITORY.provide],
    };

    export const LIST_TASK_USE_CASE = {
      provide: ListTasksUseCase.UseCase,
      useFactory: (taskRepo: TaskRepository.Repository) => {
        return new ListTasksUseCase.UseCase(taskRepo);
      },
      inject: [REPOSITORIES.TASK_REPOSITORY.provide],
    };
  }
}
