import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserController } from '../src/user/infra/nest/user.controller';
import { CreateUserUseCase } from '../src/user/application/use-cases';
import { CreateUserDto } from '../src/user/infra/nest/dto/create-user.dto';
import { UserOutput } from '../src/user/application/dto/user.output';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  const mockCreateUserUseCase = {
    execute: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: CreateUserUseCase.UseCase,
          useValue: mockCreateUserUseCase,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST user', () => {
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

    return request(app.getHttpServer())
      .post('/user')
      .send(createUserDto)
      .expect(201)
      .expect({
        name: 'John Doe',
        email: 'john.doe@example.com',
      });
  });
});
