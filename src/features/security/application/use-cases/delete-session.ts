import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { AuthDevicesRepository } from 'src/features/auth/infrastructure/auth-devices-repository';
import { AuthDevicesQueryRepository } from 'src/features/auth/infrastructure/auth-devices-query-repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class DeleteDevice {
  constructor(
    public refreshToken: string,
    public id: string,
  ) {}
}

@CommandHandler(DeleteDevice)
export class DeleteSessionHandler implements ICommandHandler<DeleteDevice> {
  constructor(
    protected authDevicesRepository: AuthDevicesRepository,
    protected authDevicesQueryRepository: AuthDevicesQueryRepository,
    protected jwtService: JwtService,
  ) {}

  async execute({ refreshToken, id }: DeleteDevice) {
    console.log(refreshToken);
    const { sub, deviceId } = this.jwtService.decode(refreshToken);
    // console.log(userId);
    const session = await this.authDevicesQueryRepository
      .getDeviceByDeviceId(id)
      .exec();
    if (!session) throw new NotFoundException();
    if (session.isActive === false) {
      await this.authDevicesRepository.deleteSession(deviceId);
      throw new NotFoundException();
    }
    if (session.userId !== sub) throw new ForbiddenException();

    await this.authDevicesRepository.deleteSession(deviceId);
    return true;
  }
}
