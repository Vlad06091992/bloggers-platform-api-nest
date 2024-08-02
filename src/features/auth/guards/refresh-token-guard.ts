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
import { getRefreshTokenFromContextOrRequest } from 'src/utils';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    @Inject() protected jwtService: JwtService,
    @Inject() protected configService: ConfigService,
    @Inject() protected commandBus: CommandBus,
  ) {}

  async canActivate(context: ExecutionContext) {
    const refreshToken = getRefreshTokenFromContextOrRequest(context, null);

    try {
      const { deviceId } = this.jwtService.decode(refreshToken);
      const isActiveDevice = await this.commandBus.execute(
        new IsActiveDeviceCommand(deviceId),
      );

      if (!isActiveDevice) {
        throw new UnauthorizedException();
      }
      await this.jwtService.verify(refreshToken, {
        secret: this.configService.get('SECRET_KEY'),
        ignoreExpiration: false,
      });

      // console.log(result);
      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
