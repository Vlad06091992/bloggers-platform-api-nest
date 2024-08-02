import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  AuthDevices,
  AuthDevicesModel,
} from 'src/features/auth/domain/devices-schema';

@Injectable()
export class AuthDevicesQueryRepository {
  constructor(
    @InjectModel(AuthDevices.name)
    private authDevicesModel: AuthDevicesModel,
  ) {}

  getDevicesByUserId(userId: string) {
    return this.authDevicesModel.find({ userId, isActive: true });
  }

  getDeviceByDeviceId(deviceId: string) {
    return this.authDevicesModel.findOne({ deviceId });
  }
}
