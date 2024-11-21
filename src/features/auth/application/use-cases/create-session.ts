import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateSessionDto } from 'src/features/auth/api/models/create-session-dto';
import { AuthDevices } from 'src/features/auth/entities/devices.entity';
import { AuthDevicesRepository } from 'src/features/auth/infrastructure/auth-devices-repository';
import { generateUuidV4 } from 'src/utils';

export class CreateSessionCommand {
  constructor(public sessionDTO: CreateSessionDto) {}
}

@CommandHandler(CreateSessionCommand)
export class CreateSessionlHandler
  implements ICommandHandler<CreateSessionCommand>
{
  constructor(protected authDevicesRepository: AuthDevicesRepository) {}

  async execute({
    sessionDTO: { ip, title, deviceId, userId },
  }: CreateSessionCommand) {
    const device = new AuthDevices(
      ip,
      generateUuidV4(),
      true,
      deviceId,
      userId,
      title,
      new Date(),
    );

    await this.authDevicesRepository.addSession(device);
    return true;
  }
}
