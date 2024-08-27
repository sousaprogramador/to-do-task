import { UserOutput } from '../../application/dto/user.output';

export class UserPresenter {
  name: string;
  email: string;

  constructor(output: UserOutput) {
    this.name = output.name;
    this.email = output.email;
  }
}

export class UserPresenterCollectionPresenter {
  data: UserPresenter[];
}
