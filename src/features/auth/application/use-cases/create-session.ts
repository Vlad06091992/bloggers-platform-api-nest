import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateSessionDto } from 'src/features/auth/api/models/create-session-dto';
import { AuthDevices } from 'src/features/auth/domain/devices-schema';
import { ObjectId } from 'mongodb';
import { AuthDevicesRepository } from 'src/features/auth/infrastructure/auth-devices-repository';
import { generateUuidV4 } from 'src/utils';
import { Prop } from '@nestjs/mongoose';

export class CreateSessionCommand {
  constructor(public sessionDTO: CreateSessionDto) {}
}

@CommandHandler(CreateSessionCommand)
export class CreateSessionlHandler
  implements ICommandHandler<CreateSessionCommand>
{
  constructor(protected authDevicesRepository: AuthDevicesRepository) {}

  async execute({ sessionDTO }: CreateSessionCommand) {
    const device: AuthDevices = {
      ...sessionDTO,
      lastActiveDate: new Date(),
      isActive: true,
    };

    await this.authDevicesRepository.addSession(device);
    return true;
  }
}
