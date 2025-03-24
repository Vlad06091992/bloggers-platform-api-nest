import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getValidQueryParamsForQuizQuestions = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const isValidSortValues = (value) => {
      const validSortValues = [
        'title',
        'shortDescription',
        'content',
        'blogId',
        'blogName',
        'createdAt',
        'body',
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
      bodySearchTerm = '',
      publishedStatus = 'all',
    } = request.query;

    return {
      pageNumber,
      pageSize,
      publishedStatus,
      bodySearchTerm,
      sortBy: isValidSortValues(sortBy) ? sortBy : 'createdAt',
      sortDirection: isValidSortDirection(sortDirection)
        ? sortDirection.toUpperCase()
        : 'desc',
    };
    // }
  },
);
