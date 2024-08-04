import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateJWTCommand } from 'src/features/auth/application/use-cases/generate-jwt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { AuthDevicesRepository } from 'src/features/auth/infrastructure/auth-devices-repository';
import { decodeToken } from 'src/utils';
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
    const { deviceId, tokenId } = decodeToken(oldToken) || null;
    await this.authDevicesRepository.deactivateDevice(deviceId);
    await this.commandBus.execute(new WriteOldTokenCommand(tokenId));
    return true;
  }
}
