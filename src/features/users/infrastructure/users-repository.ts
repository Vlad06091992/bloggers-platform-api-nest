import { User, UserModel } from 'src/features/users/domain/user-schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { QueryParams } from 'src/shared/common-types';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: UserModel) {}

  async createUser(user: User) {
    const res = await this.userModel.insertMany([user]);

    const { email, id, login, createdAt } = res[0];

    return { email, id, login, createdAt };
  }

  async findAll(params: QueryParams) {
    const projection = { _id: 0, password: 0, registrationData: 0, __v: 0 };
    return this.userModel.pagination(params, projection);
  }
}
