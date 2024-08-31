import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import {
  CreateUserUseCase,
  GetUserUseCase,
} from '../user/application/use-cases';
import GetTokensUseCase from '../auth/application/use-cases/get-tokens.use-case';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { UserOutput } from '../user/application/dto/user.output';

describe('AuthController', () => {
  let controller: AuthController;
  let getUserUseCase: GetUserUseCase.UseCase;
  let createUserUseCase: CreateUserUseCase.UseCase;
  let getTokensUseCase: GetTokensUseCase.UseCase;

  const mockGetUserUseCase = { execute: jest.fn() };
  const mockCreateUserUseCase = { execute: jest.fn() };
  const mockGetTokensUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: GetUserUseCase.UseCase, useValue: mockGetUserUseCase },
        { provide: CreateUserUseCase.UseCase, useValue: mockCreateUserUseCase },
        { provide: GetTokensUseCase.UseCase, useValue: mockGetTokensUseCase },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    getUserUseCase = module.get<GetUserUseCase.UseCase>(GetUserUseCase.UseCase);
    createUserUseCase = module.get<CreateUserUseCase.UseCase>(
      CreateUserUseCase.UseCase,
    );
    getTokensUseCase = module.get<GetTokensUseCase.UseCase>(
      GetTokensUseCase.UseCase,
    );
  });

  describe('login', () => {
    it('should return tokens if credentials are correct', async () => {
      const loginDto: LoginUserDto = {
        email: 'john.doe@example.com',
        password: 'password123',
      };
      const userOutput: UserOutput = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: await bcrypt.hash(loginDto.password, 10),
      };
      const tokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockGetUserUseCase.execute.mockResolvedValue(userOutput);
      mockGetTokensUseCase.execute.mockResolvedValue(tokens);

      const result = await controller.login(loginDto);

      expect(getUserUseCase.execute).toHaveBeenCalledWith({
        email: loginDto.email,
      });
      expect(getTokensUseCase.execute).toHaveBeenCalledWith({
        id: userOutput.id,
        name: userOutput.name,
        email: userOutput.email,
      });
      expect(result).toEqual({
        ...tokens,
        exp: expect.any(Number),
        user: {
          id: userOutput.id,
          name: userOutput.name,
          email: userOutput.email,
        },
      });
    });

    it('should throw BadRequestException if user is not found', async () => {
      const loginDto: LoginUserDto = {
        email: 'john.doe@example.com',
        password: 'password123',
      };
      mockGetUserUseCase.execute.mockResolvedValue(null);
      await expect(controller.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(getUserUseCase.execute).toHaveBeenCalledWith({
        email: loginDto.email,
      });
    });

    it('should throw BadRequestException if password is incorrect', async () => {
      const loginDto: LoginUserDto = {
        email: 'john.doe@example.com',
        password: 'password123',
      };
      const userOutput: UserOutput = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: await bcrypt.hash('wrongpassword', 10),
      };

      mockGetUserUseCase.execute.mockResolvedValue(userOutput);
      await expect(controller.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(getUserUseCase.execute).toHaveBeenCalledWith({
        email: loginDto.email,
      });
    });
  });

  describe('register', () => {
    it('should return the user if registration is successful', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };
      const userOutput: UserOutput = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '',
      };

      mockCreateUserUseCase.execute.mockResolvedValue(userOutput);
      const result = await controller.register(createUserDto);

      expect(createUserUseCase.execute).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({
        name: 'John Doe',
        email: 'john.doe@example.com',
      });
    });

    it('should throw BadRequestException if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      mockCreateUserUseCase.execute.mockRejectedValue(
        new Error('User already exists'),
      );
      await expect(controller.register(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(createUserUseCase.execute).toHaveBeenCalledWith(createUserDto);
    });
  });
});
