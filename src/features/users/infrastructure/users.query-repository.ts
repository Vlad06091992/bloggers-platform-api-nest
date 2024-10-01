import { BadRequestException, Injectable } from '@nestjs/common';
import { RequiredParamsValuesForUsers } from 'src/shared/common-types';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { mapRawUserToExtendedModel } from 'src/utils';
import { User } from 'src/features/users/entities/user';
import { UserRegistrationData } from 'src/features/users/entities/user-registration-data';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(User) protected userRepo: Repository<User>,
    @InjectRepository(UserRegistrationData)
    protected userRegDataRepo: Repository<UserRegistrationData>,
  ) {}

  async getUserById(id: string) {
    return await this.userRepo.findOne({
      where: { id },
      relations: ['userRegistrationData'],
    });
  }

  async findUserByEmailOrLogin(emailOrLogin: string) {
    try {
      debugger;
      const res = await this.userRepo.findOne({
        where: [{ email: emailOrLogin }, { login: emailOrLogin }],
        relations: ['userRegistrationData'],
      });
      debugger;
      return res;
    } catch (error) {
      console.error('Error finding user by email or login:', error);
      throw error;
    }
  }

  async findUserByEmail(email: string) {
    return await this.userRepo.findOne({
      where: { email },
      relations: ['userRegistrationData'],
    });
  }

  async findUserByLogin(login: string) {
    return await this.userRepo.findOne({
      where: { login },
      relations: ['userRegistrationData'],
    });
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
