import {
  RegistrationData,
  User,
  UserModel,
} from 'src/features/users/domain/user-schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

type CreateUser = {
  newUser: User;
  registrationData: RegistrationData;
};

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private userModel: UserModel,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  async createUser({ newUser, registrationData }: CreateUser) {
    const { id, email, login, createdAt, password } = newUser;
    const { userId, confirmationCode, isConfirmed, expirationDate } =
      registrationData;

    const createUserQuery = `INSERT INTO public."User"(
         "id", "email", "login", "createdAt", "password")
         VALUES ($1, $2, $3, $4, $5);`;
    await this.dataSource.query(createUserQuery, [
      id,
      email,
      login,
      createdAt,
      password,
    ]);

    const createUserRegistrationDataQuery = `INSERT INTO public."UserRegistrationData"(
          "userId", "confirmationCode", "expirationDate", "isConfirmed")
           VALUES ($1, $2, $3, $4);`;
    await this.dataSource.query(createUserRegistrationDataQuery, [
      userId,
      confirmationCode,
      expirationDate,
      isConfirmed,
    ]);

    return { id, email, login, createdAt };
  }

  async confirmUserByUserId(userId: string) {
    const query = `UPDATE public."UserRegistrationData"
        SET "isConfirmed"=true
        WHERE "userId" = $1;`;
    const result = await this.dataSource.query(query, [userId]);
    return result[1] == 1;
  }

  async updateUserPassword(userId: string, passwordHash: string) {
    const query = `UPDATE public."User"
        SET "password" = $2
        WHERE "id" = $1;`;
    const result = await this.dataSource.query(query, [userId, passwordHash]);
    return result[1] == 1;
  }

  async updateConfirmationCode(userId: string, confirmationCode: string) {
    const query = `UPDATE public."UserRegistrationData"
       SET "confirmationCode"= $2
       WHERE "userId" = $1`;
    const result = await this.dataSource.query(query, [
      userId,
      confirmationCode,
    ]);
    return result[1] == 1;
  }

  async removeUserById(id: string) {
    const query = `DELETE FROM public."User" CASCADE
    WHERE "id" = $1`;
    try {
      const result = await this.dataSource.query(query, [id]);
      return result[1] == 1;
    } catch (e) {
      throw new NotFoundException();
    }
  }

  clearData() {
    this.dataSource.query(`TRUNCATE TABLE public."User" CASCADE;`, []);
    this.dataSource.query(`TRUNCATE TABLE public."UserRegistrationData";`, []);
  }
}
