import { UserValidatorFactory } from '../validators/user.validators';

export type UserProperties = {
  id?: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
};

export type UserPropsJson = Required<{ id: string } & UserProperties>;

export class User {
  constructor(public readonly props: UserProperties) {}

  update(props: UserProperties): void {
    this.validate(props);
    this.name = props.name;
    this.email = props.email;
  }

  private validate(props: UserProperties): void {
    const validator = UserValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new Error('Validation failed for the provided properties');
    }
  }

  get id() {
    return this.props.id;
  }

  private set id(value) {
    this.props.id = value;
  }

  get name() {
    return this.props.name;
  }

  private set name(value) {
    this.props.name = value;
  }

  get email() {
    return this.props.email;
  }

  private set email(value) {
    this.props.email = value;
  }

  get password() {
    return this.props.password;
  }

  private set password(value) {
    this.props.password = value;
  }

  toJSON(): UserPropsJson {
    return { ...(this.props as UserPropsJson) };
  }
}
