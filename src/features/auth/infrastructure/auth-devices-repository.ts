import { Injectable } from '@nestjs/common';
import { AuthDevices } from 'src/features/auth/entities/devices';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

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
    const result = await this.repo.delete({
      userId: userId,
      deviceId: Not(deviceId),
    });
    return result!.affected! > 0;
  }

  async clearData() {
    await this.repo.clear();
  }
}
