import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const CheckUserByJWTAccessToken = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const accessToken = request.headers.authorization?.split(' ')[1];
    const jwtService = new JwtService();
    const configService = new ConfigService();
    if (accessToken) {
      try {
        const { sub: userId } = jwtService.verify(accessToken, {
          secret: configService.get('SECRET_KEY'),
        });

        if (userId) {
          return userId;
        }

        return null;
      } catch (e) {
        return null;
      }
    }

    if (!accessToken) {
      return null;
    }
  },
);
