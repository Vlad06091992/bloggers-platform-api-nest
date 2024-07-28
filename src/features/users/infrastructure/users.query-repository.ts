import { User, UserModel } from 'src/features/users/domain/user-schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { QueryParams } from 'src/shared/common-types';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel: UserModel) {}

  async getUserById(id: string, isViewModel: boolean) {
    const projection = isViewModel
      ? {
          _id: 0,
          password: 0,
          registrationData: 0,
          __v: 0,
        }
      : {};

    return await this.userModel
      .findOne({ _id: new ObjectId(id) }, projection)
      .exec();
  }

  async removeUserById(id: string) {
    const _id = new ObjectId(id);
    const res = await this.userModel.deleteOne({ _id }).exec();
    return res.deletedCount === 1;
  }

  async findUserByEmailOrLogin(emailOrLogin: string) {
    return await this.userModel
      .findOne({
        $or: [{ email: emailOrLogin }, { login: emailOrLogin }],
      })
      .exec();
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email: email }).exec();
  }

  async findUserByLogin(login: string) {
    return await this.userModel.findOne({ login: login }).exec();
  }

  async findUserByConfirmationCode(code: string) {
    return await this.userModel
      .findOne({ 'registrationData.confirmationCode': code })
      .exec();
  }

  async findAll(params: QueryParams) {
    const projection = { _id: 0, password: 0, registrationData: 0, __v: 0 };

    // const filter = {
    //   $or: [
    //     params.searchEmailTerm
    //       ? { email: { $regex: params.searchEmailTerm, $options: 'i' } }
    //       : params.searchLoginTerm
    //         ? { login: { $regex: params.searchLoginTerm, $options: 'i' } }
    //         : {},
    //   ],
    // };

    // const filter = {};

    //TODO Фильтр работает не совсем корректно как по мне
    const filter = {
      $or: [
        {
          login: {
            $regex: params.searchLoginTerm ?? '',
            $options: 'i',
          },
        },
        { email: { $regex: params.searchEmailTerm ?? '', $options: 'i' } },
      ],
    };

    return this.userModel.pagination(params, filter, projection);
  }
}
