import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getValidQueryParamsForUsers = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // debugger;
    const isValidSortValues = (value) => {
      const validSortValues = ['email', 'login', 'createdAt'];
      return validSortValues.includes(value);
    };

    const isValidSortDirection = (value) => {
      const validSortDirectionValues = ['asc', 'desc'];
      return validSortDirectionValues.includes(value.toLowerCase());
    };

    const {
      pageNumber = '1',
      pageSize = '10',
      sortBy,
      sortDirection = 'desc',
      searchEmailTerm = '',
      searchLoginTerm = '',
    } = request.query;

    return {
      pageNumber,
      pageSize,
      sortBy: isValidSortValues(sortBy) ? sortBy : 'createdAt',
      sortDirection: isValidSortDirection(sortDirection)
        ? sortDirection.toUpperCase()
        : 'desc',
      searchEmailTerm,
      searchLoginTerm,
    };
    // }
  },
);
