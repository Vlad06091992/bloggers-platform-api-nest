import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import process from 'process';

export const CheckUserByJWTAccessToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    const jwtService = new JwtService();
    if (token) {
      try {
        const { sub: userId } = jwtService.verify(token, {
          secret: process.env.SECRET_KEY,
        });

        if (userId) {
          return userId;
        }

        return null;
      } catch (e) {
        return null;
      }
    }

    if (!token) {
      return null;
    }
  },
);
