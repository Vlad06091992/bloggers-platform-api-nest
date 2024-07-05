import { Model, Types } from 'mongoose';
import { User } from 'src/features/users/domain/user-schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUserById(id: string, isViewModel: boolean) {
    const projection = isViewModel
      ? {
          _id: 0,
          password: 0,
          registrationData: 0,
          __v: 0,
        }
      : {};

    if (!ObjectId.isValid(id)) {
      return null;
    }

    const _id = new ObjectId(id);

    return await this.userModel.findOne({ _id }, projection).exec();
  }

  async removeUserById(id: string) {
    const _id = new ObjectId(id);
    const res = await this.userModel.deleteOne({ _id }).exec();
    return res.deletedCount === 1;
  }

  async findUserByEmailOrLogin(emailOrLogin: string) {
    return this.userModel.findOne({
      $or: [{ email: emailOrLogin }, { login: emailOrLogin }],
    });
  }
  async getUsers() {
    return await this.userModel.find().exec();
  }
}
