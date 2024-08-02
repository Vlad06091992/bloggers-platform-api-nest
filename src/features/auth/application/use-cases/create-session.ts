import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from 'src/features/users/application/users.service';
import { CreateSessionDto } from 'src/features/auth/api/models/create-session-dto';
import { AuthDevices } from 'src/features/auth/domain/devices-schema';
import { ObjectId } from 'mongodb';
import { AuthDevicesRepository } from 'src/features/auth/infrastructure/auth-devices-repository';

export class CreateSessionCommand {
  constructor(public sessionDTO: CreateSessionDto) {}
}

@CommandHandler(CreateSessionCommand)
export class CreateSessionlHandler
  implements ICommandHandler<CreateSessionCommand>
{
  constructor(protected authDevicesRepository: AuthDevicesRepository) {}

  async execute({ sessionDTO }: CreateSessionCommand) {
    const _id = new ObjectId();

    const device: AuthDevices = {
      ...sessionDTO,
      _id,
      id: _id.toString(),
      lastActiveDate: new Date().toISOString(),
      isActive: true,
    };

    await this.authDevicesRepository.addDevice(device);
    return true;
  }
}
