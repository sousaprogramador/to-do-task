import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { CreateUserUseCase } from '../../application/use-cases';
import { CreateUserDto } from './dto/create-user.dto';
import { UserOutput } from '../../application/dto/user.output';
import { UserPresenter } from './user.presenter';

describe('UserController', () => {
  let controller: UserController;
  let createUserUseCase: CreateUserUseCase.UseCase;

  const mockCreateUserUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: CreateUserUseCase.UseCase,
          useValue: mockCreateUserUseCase,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    createUserUseCase = module.get<CreateUserUseCase.UseCase>(
      CreateUserUseCase.UseCase,
    );
  });

  it('should create a new user and return the presenter', async () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const userOutput: UserOutput = {
      _id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '',
    };

    mockCreateUserUseCase.execute.mockResolvedValue(userOutput);

    const result = await controller.create(createUserDto);

    expect(createUserUseCase.execute).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual(new UserPresenter(userOutput));
  });
});
