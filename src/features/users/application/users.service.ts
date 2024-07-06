import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/features/users/api/models/create-user.dto';
import { User } from 'src/features/users/domain/user-schema';
import { ObjectId } from 'mongodb';
import { UsersRepository } from 'src/features/users/infrastructure/users-repository';
import * as bcrypt from 'bcrypt';
import { UsersQueryRepository } from 'src/features/users/infrastructure/users.query-repository';
import { QueryParams } from '../../../shared/common-types';

@Injectable()
export class UsersService {
  constructor(
    @Inject() protected usersRepository: UsersRepository,
    @Inject() protected usersQueryRepository: UsersQueryRepository,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const _id = new ObjectId();

    const newUser: User = {
      createdAt: new Date().toISOString(),
      _id,
      id: _id.toString(),
      email: createUserDto.email,
      login: createUserDto.login,
      password: await this.createHash(createUserDto.password),
      registrationData: {
        registrationData: new Date().toISOString(),
        confirmationCode: 'ddd',
        isConfirmed: true,
      },
    };

    return await this.usersRepository.createUser(newUser);
  }

  async findAll(params: QueryParams) {
    // return params;
    return await this.usersQueryRepository.findAll(params);
  }

  async createHash(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async findOne(id: string) {
    return await this.usersQueryRepository.getUserById(id, true);
  }

  async findUserByEmailOrLogin(emailOrLogin: string) {
    return await this.usersQueryRepository.findUserByEmailOrLogin(emailOrLogin);
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: string) {
    return this.usersQueryRepository.removeUserById(id);
  }
}
