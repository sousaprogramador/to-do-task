import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
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
