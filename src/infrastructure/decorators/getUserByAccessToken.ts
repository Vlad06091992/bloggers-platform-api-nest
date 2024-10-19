import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const GetUserByAccessToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const accessToken = request.headers.authorization?.split(' ')[1];
    debugger;
    if (!accessToken)
      throw new UnauthorizedException({
        errorsMessages: [
          {
            message: 'access token not found',
          },
        ],
      });

    debugger;
    return request.user;
  },
);
