import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthDevices } from 'src/features/auth/domain/devices-schema';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthDevicesRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async addSession(record: AuthDevices) {
    const { ip, title, deviceId, userId, isActive, lastActiveDate } = record;

    const query = `INSERT INTO public."AuthDevices"(
        "ip", "title", "deviceId", "userId","isActive","lastActiveDate")
       VALUES ($1, $2, $3, $4, $5,$6);`;
    await this.dataSource.query(query, [
      ip,
      title,
      deviceId,
      userId,
      isActive,
      lastActiveDate,
    ]);
  }

  async deactivateSessionByDeviceId(deviceId: string) {
    const query = `UPDATE "AuthDevices" 
       SET  "isActive" ='false'
       WHERE "deviceId" = $1;`;
    const result = await this.dataSource.query(query, [deviceId]);
    return result[1] == 1;
  }

  async deleteSession(deviceId: string) {
    const query = `DELETE FROM public."AuthDevices"
     WHERE "deviceId" = $1;`;
    try {
      const result = await this.dataSource.query(query, [deviceId]);
      return result[1] == 1;
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async updateSessionByDeviceId(deviceId: string) {
    const lastActiveDate = new Date();

    const query = `UPDATE "AuthDevices" 
       SET  "lastActiveDate" = $2
       WHERE "deviceId" = $1;`;
    const result = await this.dataSource.query(query, [
      deviceId,
      lastActiveDate,
    ]);
    return result[1] == 1;
  }

  async deactivateAllDevicesExceptThisOne(deviceId: string, userId: string) {
    const query = `DELETE FROM public."AuthDevices"
         WHERE "userId" = $2 
         AND "deviceId" != $1`;
    const result = await this.dataSource.query(query, [deviceId, userId]);
    return result[1] > 0;
  }

  async clearData() {
    const query = `TRUNCATE TABLE public."AuthDevices"`;
    return this.dataSource.query(query, []);
  }
}
