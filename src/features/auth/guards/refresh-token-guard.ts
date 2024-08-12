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
import { IsOldTokenCommand } from 'src/features/auth/application/use-cases/is-old-token';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    @Inject() protected jwtService: JwtService,
    @Inject() protected configService: ConfigService,
    @Inject() protected commandBus: CommandBus,
  ) {}

  async canActivate(context: ExecutionContext) {
    const refreshToken = getRefreshTokenFromContextOrRequest(context, null);
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const res = decodeToken(refreshToken);

    const isActiveDevice = await this.commandBus.execute(
      new IsActiveDeviceCommand(res.deviceId),
    );

    const isOldToken = await this.commandBus.execute(
      new IsOldTokenCommand(res.tokenId),
    );

    if (isOldToken) {
      throw new UnauthorizedException();
    }
    if (context.switchToHttp().getRequest().url.includes('security')) {
      if (!isActiveDevice) {
        return true;
      }
    }

    if (!isActiveDevice) {
      throw new UnauthorizedException();
    }

    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get('SECRET_KEY'),
      });

      return true;
    } catch (e) {
      if (
        e.name === 'TokenExpiredError' &&
        context.switchToHttp().getRequest().url.includes('security')
      ) {
        return true;
      }

      throw new UnauthorizedException();
    }
  }
}
