import { JwtService } from '@nestjs/jwt';
import { UseCase as DefaultUseCase } from '../../../common';

namespace GetTokensUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    private jwtService = new JwtService();
    private jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
    private jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

    async execute({ id, name, email, avata }: Input): Promise<Output> {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          {
            name,
            email,
            avata,
            sub: id,
          },
          {
            expiresIn: 15 * 60 * 1000,
            secret: this.jwtAccessSecret,
          },
        ),
        this.jwtService.signAsync(
          {
            name,
            email,
            avata,
            sub: id,
          },
          {
            secret: this.jwtRefreshSecret,
            expiresIn: '1d',
          },
        ),
      ]);

      return { accessToken, refreshToken };
    }
  }

  export type Input = {
    id: string;
    name: string;
    email: string;
    avata: string;
  };
  export type Output = { accessToken: string; refreshToken: string };
}

export default GetTokensUseCase;
