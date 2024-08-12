import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  AuthDevices,
  AuthDevicesModel,
} from 'src/features/auth/domain/devices-schema';

@Injectable()
export class AuthDevicesRepository {
  constructor(
    @InjectModel(AuthDevices.name)
    private authDevicesModel: AuthDevicesModel,
  ) {}

  async addSession(record: AuthDevices) {
    return (await this.authDevicesModel.create(record)).toObject();
  }

  async deactivateSessionByDeviceId(deviceId: string) {
    const res = await this.authDevicesModel
      .updateOne({ deviceId }, { $set: { isActive: false } })
      .exec();
    return res.matchedCount == 1;
  }

  async deleteSession(deviceId: string) {
    const res = await this.authDevicesModel.deleteOne({ deviceId }).exec();
    return res.deletedCount == 1;
  }

  async updateSessionByDeviceId(deviceId: string) {
    const res = await this.authDevicesModel
      .updateOne(
        { deviceId },
        { $set: { lastActiveDate: new Date().toISOString() } },
      )
      .exec();
    return res.matchedCount == 1;
  }

  async deactivateAllDevicesExceptThisOne(deviceId: string, userId: string) {
    const res = await this.authDevicesModel
      .deleteMany({
        $and: [{ userId: userId }, { deviceId: { $ne: deviceId } }],
      })
      .exec();
    return res.deletedCount > 0;
  }

  async clearData() {
    await this.authDevicesModel.deleteMany({});
  }
}
