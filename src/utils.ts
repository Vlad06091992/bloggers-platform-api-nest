import { ExecutionContext } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

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
  return refreshToken;
};

export const decodeToken = (token) => {
  const base64Payload = token.split('.')[1];
  const payloadBuffer = Buffer.from(base64Payload, 'base64');
  return JSON.parse(payloadBuffer.toString()) as any;
};

export const mapRawUserToExtendedModel = (rawResult) => ({
  id: rawResult.id,
  login: rawResult.login,
  email: rawResult.email,
  createdAt: rawResult.createdAt,
  password: rawResult.password,
  registrationData: {
    confirmationCode: rawResult.confirmationCode,
    isConfirmed: rawResult.isConfirmed,
    expirationDate: rawResult.expirationDate,
  },
});

export const generateUuidV4 = () => uuidv4();

export function isValidUUIDv4(uuid) {
  const uuidv4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidv4Regex.test(uuid);
}
