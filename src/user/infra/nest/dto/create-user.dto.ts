import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUserUseCase } from '../../../application/use-cases';

export class CreateUserDto implements CreateUserUseCase.Input {
  @ApiProperty({
    type: 'string',
    example: 'Maatews Due',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'string',
    example: 'maatews@mail.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: 'string',
    example: 'secret',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
