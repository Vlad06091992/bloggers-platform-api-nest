import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthDevicesQueryRepository } from 'src/features/auth/infrastructure/auth-devices-query-repository';

export class IsActiveDeviceCommand {
  constructor(public deviceId: string) {}
}

@CommandHandler(IsActiveDeviceCommand)
export class IsActiveDeviceHandler
  implements ICommandHandler<IsActiveDeviceCommand>
{
  constructor(
    protected authDevicesQueryRepository: AuthDevicesQueryRepository,
  ) {}

  async execute({ deviceId }: IsActiveDeviceCommand) {
    // console.log(deviceId);

    const device = await this.authDevicesQueryRepository
      .getDeviceByDeviceId(deviceId)
      .exec();

    // console.log(device);

    if (device === null || device.isActive === false) return false;
    return true;
  }
}
