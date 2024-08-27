export enum STATUS {
  PENDING = 'PENDING',
  CONCLUED = 'CONCLUED',
  CANCELED = 'CANCELED',
}

export type TaskProperties = {
  id?: string;
  title: string;
  description: string;
  image?: string;
  userId?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
  status: STATUS;
};

export type TaskPropsJson = Required<{ id: string } & TaskProperties>;

export class Task {
  constructor(public readonly props: TaskProperties) {}

  update(props: TaskProperties): void {
    this.title = props.title;
    this.description = props.description;
    this.image = props.image;
    this.userId = props.userId;
  }

  get id() {
    return this.props.id;
  }

  private set id(value) {
    this.props.id = value;
  }

  get title() {
    return this.props.title;
  }

  private set title(value) {
    this.props.title = value;
  }

  get description() {
    return this.props.description;
  }

  private set description(value) {
    this.props.description = value;
  }

  get image() {
    return this.props.image;
  }

  private set image(value) {
    this.props.image = value;
  }

  get userId() {
    return this.props.userId;
  }

  private set userId(value) {
    this.props.userId = value;
  }

  toJSON(): TaskPropsJson {
    return { ...(this.props as TaskPropsJson) };
  }
}
