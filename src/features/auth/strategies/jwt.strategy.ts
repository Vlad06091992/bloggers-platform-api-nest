import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/features/auth/application/auth.service';
import process from 'process';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  // async validate(username: string, password: string): Promise<any> {
  //   const user = await this.authService.validateUser(username, password);
  //   if (!user) {
  //     throw new UnauthorizedException();
  //   }
  //   return user;
  // }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }

  // async validate(username: string, password: string) {
  //   const user = await this.authService.validateUser(username, password);
  //   return { userId: user.id, username: user.login };
  // }
}
