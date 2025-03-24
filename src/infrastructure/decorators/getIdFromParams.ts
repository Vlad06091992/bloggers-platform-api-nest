import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { isValidUUIDv4 } from 'src/utils';

export const GetIdFromParams = createParamDecorator(
  (data: { paramName: string }, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const id = request.params[data?.paramName || 'id'];

    if (id === undefined || id === 'undefined') {
      throw new ForbiddenException();
    }

    if (id.includes('_')) {
      throw new BadRequestException();
    }

    if (isValidUUIDv4(id)) return id;
    throw new NotFoundException('Invalid ID format');
  },
);
