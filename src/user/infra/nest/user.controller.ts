import { Controller, Post, Body, Injectable } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases';
import { CreateUserDto } from './dto/create-user.dto';
import { UserPresenter } from './user.presenter';
import { UserOutput } from '../../application/dto/user.output';

@Controller('user')
@Injectable()
export class UserController {
  constructor(private readonly createUseCase: CreateUserUseCase.UseCase) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const output = await this.createUseCase.execute(createUserDto);
    return UserController.UserPresenterToResponse(output);
  }

  static UserPresenterToResponse(output: UserOutput) {
    return new UserPresenter(output);
  }
}
