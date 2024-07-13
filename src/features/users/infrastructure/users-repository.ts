import { User, UserModel } from 'src/features/users/domain/user-schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { add } from 'date-fns';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: UserModel) {}

  async createUser(user: User) {
    const res = await this.userModel.insertMany([user]);

    const { email, id, login, createdAt } = res[0];

    return { email, id, login, createdAt };
  }

  async confirmUserByConfirmationCode(code: string) {
    const result = await this.userModel
      .updateOne(
        { 'registrationData.confirmationCode': code },
        { $set: { 'registrationData.isConfirmed': true } },
      )
      .exec();

    return result.matchedCount === 1;
  }

  async updateUserPassword(userId: string, passwordHash: string) {
    const result = await this.userModel
      .updateOne({ id: userId }, { $set: { password: passwordHash } })
      .exec();

    return result.matchedCount === 1;
  }

  async updateConfirmationCode(userId: string, confirmationCode: string) {
    const result = await this.userModel
      .updateOne(
        { id: userId },
        {
          $set: {
            'registrationData.confirmationCode': confirmationCode,
            'registrationData.expirationDate': add(new Date(), { hours: 1 }),
          },
        },
      )
      .exec();

    return result.matchedCount === 1;
  }

  async clearData() {
    await this.userModel.deleteMany({});
  }
}
