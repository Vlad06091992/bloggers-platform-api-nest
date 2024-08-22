import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { AuthDevicesRepository } from 'src/features/auth/infrastructure/auth-devices-repository';
import { AuthDevicesQueryRepository } from 'src/features/auth/infrastructure/auth-devices-query-repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class DeleteDevice {
  constructor(
    // public refreshToken: string,
    public deviceId: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeleteDevice)
export class DeleteSessionHandler implements ICommandHandler<DeleteDevice> {
  constructor(
    protected authDevicesRepository: AuthDevicesRepository,
    protected authDevicesQueryRepository: AuthDevicesQueryRepository,
    protected jwtService: JwtService,
    protected commandBus: CommandBus,
  ) {}

  async execute({ deviceId, userId }: DeleteDevice) {
    try {
      const session =
        await this.authDevicesQueryRepository.getDeviceByDeviceId(deviceId);
      // debugger;
      if (!session) throw new NotFoundException();
      if (session.isActive === false) {
        await this.authDevicesRepository.deleteSession(deviceId);
        throw new NotFoundException();
      }
      // debugger;
      if (session.userId !== userId) {
        throw new ForbiddenException();
      }
    } catch (e) {
      if (e.message.includes('неверный синтаксис для типа uuid:')) {
        throw new NotFoundException();
      }

      if (e.name === 'NotFoundException') {
        throw new NotFoundException();
      }

      throw new ForbiddenException();
    }

    await this.authDevicesRepository.deactivateSessionByDeviceId(deviceId);
    return true;
  }
}
