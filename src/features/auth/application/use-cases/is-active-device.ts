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
    if (!deviceId) return false;

    const device = await this.authDevicesQueryRepository
      .getDeviceByDeviceId(deviceId)
      .exec();

    if (!device || device.isActive === false) return false;
    return true;
  }
}
