import {
  createParamDecorator,
  ExecutionContext,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';

export const isValidIdParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const res = ctx.switchToHttp().getResponse();

    const { id } = request.params;

    if (!ObjectId.isValid(id)) {
      return false;
    } else {
      return id;
    }
  },
);
