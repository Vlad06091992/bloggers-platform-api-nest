import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import process from 'process';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly commandBus: CommandBus) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }
  async validate(req, payload: any) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return false;
    return { userId: payload.sub, userLogin: payload.userLogin };
  }
}
