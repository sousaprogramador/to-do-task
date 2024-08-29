import {
  Controller,
  Post,
  Body,
  Injectable,
  Get,
  Request,
  Param,
  Put,
  HttpCode,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { TaskOutput } from '../../application/dto/task.output';
import { JwtAuthGuard } from '../../../auth/jwt/jwt.guard';
import {
  CreateTaskUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  GetTaskUseCase,
  ListTasksUseCase,
} from '../../application/use-cases';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskPresenter } from './task.presenter';

@Controller('task')
@Injectable()
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(
    private readonly listUseCase: ListTasksUseCase.UseCase,
    private readonly getUseCase: GetTaskUseCase.UseCase,
    private readonly deleteUseCase: DeleteTaskUseCase.UseCase,
    private readonly createUseCase: CreateTaskUseCase.UseCase,
    private readonly updateUseCase: UpdateTaskUseCase.UseCase,
  ) {}

  @Get()
  async search(@Request() req) {
    const output = await this.listUseCase.execute({ userId: req.user.id });
    return output.map(TaskController.TaskPresenterToResponse);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getUseCase.execute({ id });
    if (!output) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return TaskController.TaskPresenterToResponse(output);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    const output = await this.createUseCase.execute({
      ...createTaskDto,
      user: req.user,
    });
    return TaskController.TaskPresenterToResponse(output);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const output = await this.updateUseCase.execute({
      id,
      ...updateTaskDto,
    });
    return TaskController.TaskPresenterToResponse(output);
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUseCase.execute({ id });
  }

  static TaskPresenterToResponse(output: TaskOutput) {
    return new TaskPresenter(output);
  }
}
