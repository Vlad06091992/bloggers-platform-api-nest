import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/features/auth/application/auth.service';
import process from 'process';
import { CommandBus } from '@nestjs/cqrs';
import { RefreshJWTCommand } from 'src/features/auth/application/use-cases/refresh-tokens';
import { IsActiveDeviceCommand } from 'src/features/auth/application/use-cases/is-active-device';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly commandBus: CommandBus) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
      passReqToCallback: true,
    });
  }
  async validate(req, payload: any) {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) return false;

    const isActiveDevice = await this.commandBus.execute(
      new IsActiveDeviceCommand(token),
    );

    if (!isActiveDevice) return false;

    return { userId: payload.sub, userLogin: payload.userLogin };
  }
}
