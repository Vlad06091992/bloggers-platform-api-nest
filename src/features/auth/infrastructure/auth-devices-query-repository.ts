import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  AuthDevices,
  AuthDevicesModel,
} from 'src/features/auth/domain/devices-schema';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthDevicesQueryRepository {
  constructor(
    @InjectModel(AuthDevices.name)
    private authDevicesModel: AuthDevicesModel,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  getDevicesByUserId(userId: string) {
    const query = `SELECT ip, title, "deviceId","lastActiveDate"
       FROM public."AuthDevices"
       WHERE "userId" = $1 AND "isActive" = true;`;
    return this.dataSource.query(query, [userId]);
  }

  async getDeviceByDeviceId(deviceId: string) {
    const query = `SELECT "ip", "title", "deviceId","lastActiveDate", "userId", "isActive"
       FROM public."AuthDevices"
       WHERE "deviceId" = $1;`;
    const result = await this.dataSource.query(query, [deviceId]);
    return result.length ? result[0] : null;
  }
}
