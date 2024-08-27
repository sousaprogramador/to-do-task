import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  validate(req: Request, payload: any) {
    const { headers } = req;
    const { authorization } = headers;
    const refreshToken = authorization.replace('Bearer', '').trim();

    return { ...payload, refreshToken };
  }
}
