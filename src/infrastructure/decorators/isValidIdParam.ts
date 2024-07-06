import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';

export const isValidIdParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const response = ctx.switchToHttp().getResponse();
    const { id } = request.params;
    if (!ObjectId.isValid(id)) {
      response.sendStatus(404);
      // throw new NotFoundException('err', {});
    } else {
      return id;
    }
  },
);
