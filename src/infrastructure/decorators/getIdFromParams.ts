import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { isValidUUIDv4 } from 'src/utils';

export const GetIdFromParams = createParamDecorator(
  (data: { paramName: string }, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const id = request.params[data?.paramName || 'id'];
    if (isValidUUIDv4(id)) return id;
    throw new NotFoundException('Invalid ID format');
  },
);
