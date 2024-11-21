import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AuthDevices } from 'src/features/auth/entities/devices.entity';

@Injectable()
export class AuthDevicesQueryRepository {
  constructor(
    @InjectRepository(AuthDevices)
    private readonly repo: Repository<AuthDevices>,
  ) {}

  async getDevicesByUserId(userId: string) {
    return await this.repo.find({
      where: { userId, isActive: true },
      select: ['ip', 'title', 'lastActiveDate', 'deviceId'],
    });
  }

  async getDeviceByDeviceId(deviceId: string) {
    return await this.repo.findOne({ where: { deviceId } });
  }
}
