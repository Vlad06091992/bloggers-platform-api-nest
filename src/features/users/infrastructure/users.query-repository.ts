import { BadRequestException, Injectable } from '@nestjs/common';
import { RequiredParamsValuesForUsers } from 'src/shared/common-types';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Users } from 'src/features/users/entities/users';
import { UsersRegistrationData } from 'src/features/users/entities/users-registration-data';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Users) protected userRepo: Repository<Users>,
    @InjectRepository(UsersRegistrationData)
    protected userRegDataRepo: Repository<UsersRegistrationData>,
  ) {}

  async getUserById(id: string) {
    return await this.userRepo.findOne({
      where: { id },
      relations: ['userRegistrationData'],
    });
  }

  async findUserByEmailOrLogin(emailOrLogin: string) {
    try {
      return await this.userRepo.findOne({
        where: [{ email: emailOrLogin }, { login: emailOrLogin }],
        relations: ['userRegistrationData'],
      });
    } catch (error) {
      console.error('Error finding user by email or login:', error);
      throw error;
    }
  }

  async findUserByEmail(email: string) {
    try {
      return await this.userRepo.findOne({
        where: { email },
        relations: ['userRegistrationData'],
      });
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  async findUserByLogin(login: string) {
    try {
      return await this.userRepo.findOne({
        where: { login },
        relations: ['userRegistrationData'],
      });
    } catch (error) {
      console.error('Error finding user by login:', error);
      throw error;
    }
  }

  async findUserByConfirmationCode(code: string) {
    try {
      return await this.userRegDataRepo
        .createQueryBuilder('urd')
        .innerJoinAndSelect('urd.user', 'u')
        .where('urd.confirmationCode = :confirmationCode', {
          confirmationCode: code,
        })
        .select([
          'urd.id',
          'urd.confirmationCode',
          'urd.expirationDate',
          'urd.isConfirmed',
          'u.id',
          'u.email',
          'u.login',
          'u.createdAt',
          'u.password',
        ])
        .getOne();
    } catch (e) {
      throw new BadRequestException({
        errorsMessages: [{ message: 'user not exist', field: 'code' }],
      });
    }
  }

  async findAll(params: RequiredParamsValuesForUsers) {
    try {
      const {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchEmailTerm,
        searchLoginTerm,
      } = params;
      const skip = (+pageNumber - 1) * +pageSize;

      const builder = await this.userRepo
        .createQueryBuilder('u')
        .select(['u.id', 'u.email', 'u.login', 'u.createdAt'])
        .where('u.login ILIKE :searchLoginTerm', {
          searchLoginTerm: `%${searchLoginTerm}%`,
        })
        .orWhere('u.email ILIKE :searchEmailTerm', {
          searchEmailTerm: `%${searchEmailTerm}%`,
        });

      const totalCount = await builder.getCount();

      const result = await builder
        .orderBy(`u.${sortBy}`, sortDirection)
        .skip(+skip)
        .take(+pageSize)
        .getMany();

      return {
        pagesCount: Math.ceil(+totalCount / +pageSize),
        page: +pageNumber,
        pageSize: +pageSize,
        totalCount: +totalCount,
        items: result,
      };
    } catch (error) {
      console.error('Ошибка при выполнении метода users findAll:', error);
      throw error; // Или обработайте ошибку по-своему
    }
  }
}
