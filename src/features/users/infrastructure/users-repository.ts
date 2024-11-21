import { UsersEntity } from 'src/features/users/entities/users.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { UsersRegistrationDataEntity } from 'src/features/users/entities/users-registration-data.entity';

type CreateUserDTO = {
  newUser: UsersEntity;
  newUserRegistrationData: UsersRegistrationDataEntity;
};

@Injectable()
export class UsersRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(UsersEntity) protected userRepo: Repository<UsersEntity>,
    @InjectRepository(UsersRegistrationDataEntity)
    protected userRegDataRepo: Repository<UsersRegistrationDataEntity>,
  ) {}

  async createUser({ newUser, newUserRegistrationData }: CreateUserDTO) {
    const { id, email, login, createdAt } = newUser;
    await this.userRepo.insert(newUser);
    await this.userRegDataRepo.insert(newUserRegistrationData);
    return { id, email, login, createdAt };
  }

  async confirmUserByUserId(userId: string) {
    const regData = await this.userRegDataRepo
      .createQueryBuilder('urd')
      .innerJoinAndSelect('urd.user', 'u')
      .where('u.id = :userId', {
        userId,
      })
      // указываем конкретные поля, которые нужно выбрать
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
    if (regData) {
      regData.isConfirmed = true;
      await this.userRegDataRepo.save(regData);
      return true;
    } else {
      return false;
    }
  }

  async updateUserPassword(userId: string, passwordHash: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user) {
      user.password = passwordHash;
      await this.userRepo.save(user);
      return true;
    } else {
      return false;
    }
  }

  async updateConfirmationCode(userId: string, confirmationCode: string) {
    const regData = await this.userRegDataRepo.findOne({
      where: {
        user: { id: userId },
      },
    } as FindOneOptions<UsersRegistrationDataEntity>);
    if (regData) {
      regData.confirmationCode = confirmationCode;
      await this.userRegDataRepo.save(regData);
      return true;
    } else {
      return false;
    }
  }

  async removeUserById(id: string) {
    const result = await this.userRepo
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
    return result!.affected! > 0;
  }

  async clearData() {
    await this.dataSource.query(`TRUNCATE TABLE public."Users" CASCADE;`, []);
    await this.dataSource.query(
      `TRUNCATE TABLE public."UsersRegistrationData";`,
      [],
    );
  }
}
