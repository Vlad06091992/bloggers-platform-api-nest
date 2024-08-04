import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IsActiveDeviceCommand } from 'src/features/auth/application/use-cases/is-active-device';
import { CommandBus } from '@nestjs/cqrs';
import { decodeToken, getRefreshTokenFromContextOrRequest } from 'src/utils';
import { decode, verify } from 'jsonwebtoken';
@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    @Inject() protected jwtService: JwtService,
    @Inject() protected configService: ConfigService,
    @Inject() protected commandBus: CommandBus,
  ) {}

  async canActivate(context: ExecutionContext) {
    const refreshToken = getRefreshTokenFromContextOrRequest(context, null);

    // console.log(refreshToken);

    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    debugger;
    const res = decodeToken(refreshToken);
    // const res2 = verify(refreshToken, 'SECRET');
    const isActiveDevice = await this.commandBus.execute(
      new IsActiveDeviceCommand(res.deviceId),
    );

    if (!isActiveDevice) {
      throw new UnauthorizedException();
    }

    try {
      // const result = verify(
      //   refreshToken,
      //   this.configService.get('SECRET_KEY') as string,
      // );
      // debugger;

      const result = this.jwtService.verify(
        refreshToken,
        {
          secret: this.configService.get('SECRET_KEY'),
        },
        // this.configService.get('SECRET_KEY') as string,
      );
      // debugger;

      return true;
    } catch (e) {
      debugger;

      return false;
    }
  }
}
