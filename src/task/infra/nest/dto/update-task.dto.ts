import { UpdateTaskUseCase } from '../../../application/use-cases';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto
  extends CreateTaskDto
  implements Omit<UpdateTaskUseCase.Input, 'id'> {}
