import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateJWTCommand } from 'src/features/auth/application/use-cases/generate-jwt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { AuthDevicesRepository } from 'src/features/auth/infrastructure/auth-devices-repository';

export class LogoutCommand {
  constructor(public oldToken: string) {}
}

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(
    protected jwtService: JwtService,
    protected authDevicesRepository: AuthDevicesRepository,
  ) {}

  async execute({ oldToken }: LogoutCommand) {
    const { deviceId } = this.jwtService.decode(oldToken) || null;
    await this.authDevicesRepository.deactivateDevice(deviceId);
    return true;
  }
}
