import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import process from 'process';
import { CommandBus } from '@nestjs/cqrs';
import { UsersQueryRepository } from 'src/features/users/infrastructure/users.query-repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }
  async validate(req, payload: any) {
    const user = await this.usersQueryRepository.getUserById(payload.sub);
    if (!user) return false;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return false;
    return { userId: payload.sub, userLogin: payload.userLogin };
  }
}
