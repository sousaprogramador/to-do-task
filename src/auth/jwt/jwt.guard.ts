import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments.

    if (err || !user) {
      const isJwtExpired = info.message === 'jwt expired';
      if (isJwtExpired) throw new UnauthorizedException('jwt-token-expired');

      throw err || new UnauthorizedException();
    }

    return user;
  }
}
