import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/features/auth/application/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'loginOrEmail' });
    // super();
  }

  async validate(loginOrEmail: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(loginOrEmail, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

// import {
//   ExceptionFilter,
//   HttpException,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-local';
// import { AuthService } from 'src/features/auth/application/auth.service';
//
// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly authService: AuthService) {
//     super({ usernameField: 'loginOrEmail' });
//   }
//
//   async validate(loginOrEmail: string, password: string): Promise<any> {
//     const user = await this.authService.validateUser(loginOrEmail, password);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return user;
//   }
// }
