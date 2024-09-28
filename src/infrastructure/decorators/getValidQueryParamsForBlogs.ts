import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getValidQueryParamsForBlogs = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const isValidSortValues = (value) => {
      const validSortValues = [
        'name',
        'description',
        'websiteUrl',
        'createdAt',
        'isMembership',
      ];
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
      searchNameTerm = '',
    } = request.query;

    return {
      pageNumber,
      pageSize,
      sortBy: isValidSortValues(sortBy) ? sortBy : 'createdAt',
      sortDirection: isValidSortDirection(sortDirection)
        ? sortDirection.toUpperCase()
        : 'desc',
      searchNameTerm,
    };
    // }
  },
);
