import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { isValidUUIDv4 } from 'src/utils';

export const getIdFromParams = createParamDecorator(
  (data: { paramName: string }, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    debugger
    const id = request.params[data?.paramName || 'id']; // Используйте data.paramName для извлечения нужного параметра
    if (isValidUUIDv4(id)) return id;
    throw new NotFoundException('Invalid ID format');
  },
);
