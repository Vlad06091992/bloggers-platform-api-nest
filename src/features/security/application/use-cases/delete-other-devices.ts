import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { AuthDevicesRepository } from 'src/features/auth/infrastructure/auth-devices-repository';

export class DeleteOtherDevicesCommand {
  constructor(public refreshToken: string) {}
}

@CommandHandler(DeleteOtherDevicesCommand)
export class DeleteOtherDevicesHandler
  implements ICommandHandler<DeleteOtherDevicesCommand>
{
  constructor(
    protected authDevicesRepository: AuthDevicesRepository,
    protected jwtService: JwtService,
  ) {}

  async execute({ refreshToken }: DeleteOtherDevicesCommand) {
    console.log(refreshToken);
    const { sub, deviceId } = this.jwtService.decode(refreshToken);
    // console.log(userId);
    await this.authDevicesRepository.deactivateAllDevicesExceptThisOne(
      deviceId,
      sub,
    );
    return true;
  }
}
