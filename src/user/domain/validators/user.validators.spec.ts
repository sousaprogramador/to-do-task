import { UserValidatorFactory } from './user.validators';
import { UserProperties } from '../entities/user.entity';

describe('UserValidator', () => {
  const validator = UserValidatorFactory.create();

  it('should validate a valid user correctly', () => {
    const validUser: UserProperties = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
      avatar: 'some-avatar-url',
    };
    expect(validator.validate(validUser)).toBeTruthy();
  });

  it('should fail validation for missing name', () => {
    const invalidUser: UserProperties = {
      name: '',
      email: 'johndoe@example.com',
      password: '12345678',
    };
    expect(validator.validate(invalidUser)).toBeFalsy();
  });

  it('should fail validation for invalid email format', () => {
    const invalidUser: UserProperties = {
      name: 'John Doe',
      email: 'invalid-email',
      password: '12345678',
    };
    expect(validator.validate(invalidUser)).toBeFalsy();
  });

  it('should fail validation for password that is too short', () => {
    const invalidUser: UserProperties = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123',
    };
    expect(validator.validate(invalidUser)).toBeFalsy();
  });

  it('should pass validation when avatar is optional', () => {
    const validUser: UserProperties = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
    };
    expect(validator.validate(validUser)).toBeTruthy();
  });
});
