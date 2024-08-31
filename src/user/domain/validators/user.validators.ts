import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ClassValidatorFields } from '../../../common/validators';
import { UserProperties } from '../entities/user.entity';

export class UserRules {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  constructor(data: UserProperties) {
    Object.assign(this, data);
  }
}

export class UserValidator extends ClassValidatorFields<UserProperties> {
  validate(data: UserProperties): boolean {
    return super.validate(new UserRules(data ?? ({} as any)));
  }
}

export class UserValidatorFactory {
  static create() {
    return new UserValidator();
  }
}
