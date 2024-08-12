import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getRefreshTokenFromContextOrRequest } from 'src/utils';

export const GetRefreshToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return getRefreshTokenFromContextOrRequest(ctx, null);
  },
);
