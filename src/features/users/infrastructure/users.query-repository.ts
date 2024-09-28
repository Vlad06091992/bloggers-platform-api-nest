import { BadRequestException, Injectable } from '@nestjs/common';
import { RequiredParamsValuesForUsers } from 'src/shared/common-types';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { mapRawUserToExtendedModel } from 'src/utils';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getUserById(id: string) {
    const query = `SELECT u."id",u."password",u."createdAt",u."login",u."email",ur."confirmationCode",ur."expirationDate",ur."isConfirmed"
    FROM public."UserRegistrationData" as ur
    JOIN public."User" as u
    ON u."id" = ur."userId"
    WHERE u."id" = $1`;
    const rawResult = (await this.dataSource.query(query, [id]))[0];
    return rawResult ? mapRawUserToExtendedModel(rawResult) : null;
  }

  async findUserByEmailOrLogin(emailOrLogin: string) {
    const query = `SELECT u."id",u."password",u."login",u."email",ur."confirmationCode",ur."expirationDate",ur."isConfirmed"
    FROM public."UserRegistrationData" as ur
    JOIN public."User" as u
    ON u."id" = ur."userId"
    WHERE u."email" = $1 OR u."login" = $1`;
    const rawResult = (await this.dataSource.query(query, [emailOrLogin]))[0];
    return rawResult ? mapRawUserToExtendedModel(rawResult) : null;
  }

  async findUserByEmail(email: string) {
    const query = `SELECT u."id",u."password",u."login",u."email",ur."confirmationCode",ur."expirationDate",ur."isConfirmed"
    FROM public."UserRegistrationData" as ur
    JOIN public."User" as u
    ON u."id" = ur."userId"
    WHERE u."email" = $1;`;
    const rawResult = (await this.dataSource.query(query, [email]))[0];

    return rawResult ? mapRawUserToExtendedModel(rawResult) : null;
  }

  async findUserByLogin(login: string) {
    const query = `SELECT u."id",u."password",u."login",u."email",ur."confirmationCode",ur."expirationDate",ur."isConfirmed"
    FROM public."UserRegistrationData" as ur
    JOIN public."User" as u
    ON u."id" = ur."userId"
    WHERE u."login" = $1;`;
    const rawResult = (await this.dataSource.query(query, [login]))[0];

    return rawResult ? mapRawUserToExtendedModel(rawResult) : null;
  }

  async findUserByConfirmationCode(code: string) {
    try {
      const query = `SELECT u."id",u."password",u."login",u."email",ur."confirmationCode",ur."expirationDate",ur."isConfirmed"
    FROM public."UserRegistrationData" as ur
    JOIN public."User" as u
    ON u."id" = ur."userId"
    WHERE ur."confirmationCode" = $1;`;
      const rawResult = (await this.dataSource.query(query, [code]))[0];
      return rawResult ? mapRawUserToExtendedModel(rawResult) : null;
    } catch (e) {
      throw new BadRequestException({
        errorsMessages: [{ message: 'user not exist', field: 'code' }],
      });
    }
  }

  async findAll(params: RequiredParamsValuesForUsers) {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchEmailTerm,
      searchLoginTerm,
    } = params;

    const countQuery = `SELECT COUNT(*) FROM public."User"
  WHERE email ILIKE '%${searchEmailTerm}%' OR  login ILIKE '%${searchLoginTerm}%'`;
    const [{ count: totalCount }] = await this.dataSource.query(countQuery, []);
    // const totalCount = await this.dataSource.query(countQuery, []);
    const skip = (+pageNumber - 1) * +pageSize;

    const query = `
  SELECT "id", "email", "login", "createdAt"
  FROM public."User"
  WHERE  login ILIKE '%${searchLoginTerm}%'  OR email ILIKE '%${searchEmailTerm}%'
  ORDER BY "${sortBy}" ${sortDirection}
   LIMIT ${+pageSize} OFFSET ${+skip}
`;

    const items = await this.dataSource.query(query);

    return {
      pagesCount: Math.ceil(+totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items,
    };
  }
}
