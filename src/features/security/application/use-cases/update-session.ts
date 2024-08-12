import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { AuthDevicesRepository } from 'src/features/auth/infrastructure/auth-devices-repository';

export class UpdateSessionComamnd {
  constructor(public deviceId: string) {}
}

@CommandHandler(UpdateSessionComamnd)
export class UpdateSessionHandler
  implements ICommandHandler<UpdateSessionComamnd>
{
  constructor(
    protected authDevicesRepository: AuthDevicesRepository,
    protected jwtService: JwtService,
  ) {}

  async execute({ deviceId }: any) {
    await this.authDevicesRepository.updateSessionByDeviceId(deviceId);
    return true;
  }
}
