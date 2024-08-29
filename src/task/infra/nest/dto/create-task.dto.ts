import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTaskUseCase } from '../../../application/use-cases';

export class CreateTaskDto implements CreateTaskUseCase.Input {
  @ApiProperty({
    type: 'string',
    example: 'Testing',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: 'string',
    example: 'Testing',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsString()
  image?: string;

  @ApiProperty({
    type: 'string',
    example: 'Testing',
  })
  @IsString()
  status: string;
}
