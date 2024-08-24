import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { isValidUUIDv4 } from 'src/utils';

export const getIdFromParams = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const id = request.params.id;

    if (isValidUUIDv4(id)) return id;
    throw new NotFoundException('err', {});
  },
);
