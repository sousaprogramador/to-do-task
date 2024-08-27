import { User } from '../../domain/entities';
import { UserOutputMapper } from './user.output';

describe('UserOutputMapper Unit Tests', () => {
  it('should convert a aegnt in output', () => {
    const entity = new User({
      name: 'Matews',
      email: 'matews@devok.com.br',
      password: 'secret',
    });
    const spyToJSON = jest.spyOn(entity, 'toJSON');
    const output = UserOutputMapper.toOutput(entity);
    expect(spyToJSON).toHaveBeenCalled();
    expect(output).toStrictEqual({
      name: 'Matews',
      email: 'matews@devok.com.br',
      password: 'secret',
    });
  });
});
