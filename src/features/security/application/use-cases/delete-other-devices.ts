import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { AuthDevicesRepository } from 'src/features/auth/infrastructure/auth-devices-repository';
import { decodeToken } from 'src/utils';

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
    const { sub, deviceId } = decodeToken(refreshToken);

    await this.authDevicesRepository.deactivateAllDevicesExceptThisOne(
      deviceId,
      sub,
    );
    return true;
  }
}
