import { IsNotEmpty, IsString } from 'class-validator';
import { CreateTaskUseCase } from '../../../application/use-cases';

export class CreateTaskDto implements CreateTaskUseCase.Input {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsString()
  image?: string;

  @IsString()
  userId?: string;

  @IsString()
  status: string;
}
