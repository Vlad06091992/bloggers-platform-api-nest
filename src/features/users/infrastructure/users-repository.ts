import { User } from 'src/features/users/entities/user';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { UserRegistrationData } from 'src/features/users/entities/user-registration-data';

type CreateUserDTO = {
  newUser: User;
  newUserRegistrationData: UserRegistrationData;
};

@Injectable()
export class UsersRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(User) protected userRepo: Repository<User>,
    @InjectRepository(UserRegistrationData)
    protected userRegDataRepo: Repository<UserRegistrationData>,
  ) {}

  async createUser({ newUser, newUserRegistrationData }: CreateUserDTO) {
    debugger;
    const { id, email, login, createdAt } = newUser;
    await this.userRepo.insert(newUser);
    await this.userRegDataRepo.insert(newUserRegistrationData);
    return { id, email, login, createdAt };
  }

  async confirmUserByUserId(userId: string) {
    const regData = await this.userRegDataRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    } as FindOneOptions<UserRegistrationData>);
    debugger;
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
    const regData = await this.userRegDataRepo.findOne({ where: {} });
    if (regData) {
      regData.confirmationCode = confirmationCode;
      await this.userRegDataRepo.save(regData);
      return true;
    } else {
      return false;
    }
  }

  async removeUserById(id: string) {
    // await this.userRepo.delete(id);
    // await this.userRegDataRepo.delete({ userId: id });
    const query = `DELETE FROM public."User" CASCADE
    WHERE "id" = $1`;
    try {
      const result = await this.dataSource.query(query, [id]);
      return result[1] == 1;
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async clearData() {
    await this.dataSource.query(`TRUNCATE TABLE public."User" CASCADE;`, []);
    await this.dataSource.query(
      `TRUNCATE TABLE public."UserRegistrationData";`,
      [],
    );
  }
}
