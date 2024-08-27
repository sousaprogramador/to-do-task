import { User } from '../../domain/entities';

export type UserOutput = {
  name: string;
  email: string;
};

export class UserOutputMapper {
  static toOutput(entity: User): UserOutput {
    return entity?.toJSON();
  }
}
