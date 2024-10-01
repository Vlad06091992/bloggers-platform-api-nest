import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthDevices } from 'src/features/auth/entities/devices';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { OldTokensIds } from 'src/features/auth/entities/old-tokens-ids';

@Injectable()
export class AuthDevicesRepository {
  constructor(
    @InjectRepository(AuthDevices)
    private readonly repo: Repository<AuthDevices>,
  ) {}

  async addSession(device: AuthDevices) {
    await this.repo.insert(device);
  }

  async deactivateSessionByDeviceId(deviceId: string) {
    const device = await this.repo.findOne({ where: { deviceId } });
    debugger;
    if (device) {
      device.isActive = false;
      await this.repo.save(device);

      return true;
    } else {
      return false;
    }
  }

  async deleteSession(deviceId: string) {
    await this.repo.delete(deviceId);
  }

  async updateSessionByDeviceId(deviceId: string) {
    const device = await this.repo.findOne({ where: { deviceId } });

    if (device) {
      device.lastActiveDate = new Date();
      await this.repo.save(device);

      return true;
    } else {
      return false;
    }
  }

  async deactivateAllDevicesExceptThisOne(deviceId: string, userId: string) {
    // Удаляем все устройства пользователя, кроме указанного
    const result = await this.repo.delete({
      userId: userId,
      deviceId: Not(deviceId),
    });
    debugger;
    //@ts-ignore
    return result.affected > 0;
    // return result;
  }

  async clearData() {
    await this.repo.clear();
  }
}
