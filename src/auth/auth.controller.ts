import * as bcrypt from 'bcrypt';
import {
  Controller,
  Post,
  Body,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import {
  CreateUserUseCase,
  GetUserUseCase,
} from '../user/application/use-cases';
import GetTokensUseCase from '../auth/application/use-cases/get-tokens.use-case';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserOutput } from '../user/application/dto/user.output';
import { UserPresenter } from '../user/infra/nest/user.presenter';

@Controller('auth')
@Injectable()
export class AuthController {
  constructor(
    private readonly createUseCase: CreateUserUseCase.UseCase,
    private readonly getUserUseCase: GetUserUseCase.UseCase,
    private readonly getTokensUseCase: GetTokensUseCase.UseCase,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    const { email, password } = loginDto;
    const user = await this.getUserUseCase.execute({ email });

    if (!user) {
      throw new BadRequestException('Usuários ou senha inválidos.');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new BadRequestException('Usuários ou senha inválidos.');
    }

    const tokens = await this.getTokensUseCase.execute({
      id: user.id,
      name: user.name,
      email: user.email,
      avata: user.avatar,
    });

    const nowInMilliseconds = new Date().getTime();
    const addedAnother15Minutes = nowInMilliseconds + 15 * 60 * 1000;

    delete user.password;
    return { ...tokens, exp: addedAnother15Minutes, user };
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const output = await this.createUseCase.execute(createUserDto);
      return AuthController.UserPresenterToResponse(output);
    } catch (error) {
      console.log('error', error);
      throw new BadRequestException('Usuario ja registrado');
    }
  }

  static UserPresenterToResponse(output: UserOutput) {
    return new UserPresenter(output);
  }
}
