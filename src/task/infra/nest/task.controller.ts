import {
  Controller,
  Post,
  Body,
  Injectable,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
  Put,
  HttpCode,
  Delete,
} from '@nestjs/common';
import { TaskOutput } from '../../application/dto/task.output';
import {
  CreateTaskUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  GetTaskUseCase,
  ListTasksUseCase,
} from '../../application/use-cases';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
  TaskPresenter,
  TaskPresenterCollectionPresenter,
} from './task.presenter';

@Controller('task')
@Injectable()
export class TaskController {
  constructor(
    private listUseCase: ListTasksUseCase.UseCase,
    private getUseCase: GetTaskUseCase.UseCase,
    private deleteUseCase: DeleteTaskUseCase.UseCase,
    private createUseCase: CreateTaskUseCase.UseCase,
    private updateUseCase: UpdateTaskUseCase.UseCase,
  ) {}

  @Get()
  async search() {
    const output = await this.listUseCase.execute();
    return output;
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    const output = await this.getUseCase.execute({ id });
    return TaskController.TaskPresenterToResponse(output);
  }

  @Post()
  async create(@Body() createBrandDto: CreateTaskDto) {
    const output = await this.createUseCase.execute(createBrandDto);
    return TaskController.TaskPresenterToResponse(output);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateBrandDto: UpdateTaskDto,
  ) {
    const output = await this.updateUseCase.execute({
      id,
      ...updateBrandDto,
    });
    return TaskController.TaskPresenterToResponse(output);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    return this.deleteUseCase.execute({ id });
  }

  static TaskPresenterToResponse(output: TaskOutput) {
    return new TaskPresenter(output);
  }
}
