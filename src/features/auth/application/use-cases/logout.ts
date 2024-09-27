import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { AuthDevicesRepository } from 'src/features/auth/infrastructure/auth-devices-repository';
import { WriteOldTokenCommand } from 'src/features/auth/application/use-cases/write-old-token';

export class LogoutCommand {
  constructor(public oldToken: string) {}
}

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(
    protected jwtService: JwtService,
    protected authDevicesRepository: AuthDevicesRepository,
    protected commandBus: CommandBus,
  ) {}

  async execute({ oldToken }: LogoutCommand) {
    const { deviceId, tokenId } = this.jwtService.decode(oldToken) || null;
    await this.authDevicesRepository.deactivateSessionByDeviceId(deviceId);
    await this.commandBus.execute(new WriteOldTokenCommand(tokenId));

    return true;
  }
}
