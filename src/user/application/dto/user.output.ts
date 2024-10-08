import { User } from '../../domain/entities';

export type UserOutput = {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
};

export class UserOutputMapper {
  static toOutput(entity: User): UserOutput {
    return entity?.toJSON();
  }
}
