import { User, UserModel } from 'src/features/users/domain/user-schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: UserModel) {}

  async createUser(user: User) {
    const res = await this.userModel.insertMany([user]);

    const { email, id, login, createdAt } = res[0];

    return { email, id, login, createdAt };
  }

  async clearData() {
    await this.userModel.deleteMany({});
  }
}
