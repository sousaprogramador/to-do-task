export type UserProperties = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
};

export type UserPropsJson = Required<{ _id: string } & UserProperties>;

export class User {
  constructor(public readonly props: UserProperties) {}

  update(props: UserProperties): void {
    this.name = props.name;
    this.email = props.email;
  }

  get _id() {
    return this.props._id;
  }

  private set _id(value) {
    this.props._id = value;
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
