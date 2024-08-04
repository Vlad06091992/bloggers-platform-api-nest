import { ExecutionContext } from '@nestjs/common';

export async function pagination(
  {
    pageNumber = 1,
    pageSize = 10,
    sortBy = 'createdAt',
    sortDirection = 'desc',
  },
  filter = {},
  projection = {},
  map_callback = null,
) {
  const number = (+pageNumber - 1) * +pageSize;
  const res = await this.find(filter, projection)
    .skip(number)
    .limit(+pageSize)
    .sort({
      [sortBy]: sortDirection == 'asc' ? 1 : -1,
      createdAt: sortDirection == 'asc' ? 1 : -1,
    });
  // .lean();

  const totalCount = await this.countDocuments(filter);

  return {
    pagesCount: Math.ceil(+totalCount / +pageSize),
    page: +pageNumber,
    pageSize: +pageSize,
    totalCount: +totalCount,
    items: map_callback ? res.map(await map_callback) : res,
  };
}

export const getRefreshTokenFromContextOrRequest = (
  context: ExecutionContext | null,
  req: any,
) => {
  let request;

  if (context) {
    request = context.switchToHttp().getRequest();
  } else {
    request = req;
  }

  const {
    headers: { cookie: cookiesString },
  } = request;

  // console.log(request.headers.cookies);
  // console.log(request.headers.cookie);

  if (!cookiesString) return false;

  const cookies = cookiesString?.split('; ').reduce((acc, el) => {
    const key = el.split('=')[0];
    const value = el.split('=')[1];
    acc[key] = value;
    return acc;
  }, {});

  let { refreshToken } = cookies;

  if (refreshToken[refreshToken.length - 1] === ';') {
    refreshToken = refreshToken.slice(0, -1);
  }

  console.log(refreshToken);
  return refreshToken;
};

export const decodeToken = (token) => {
  const base64Payload = token.split('.')[1];
  const payloadBuffer = Buffer.from(base64Payload, 'base64');
  return JSON.parse(payloadBuffer.toString()) as any;
};
