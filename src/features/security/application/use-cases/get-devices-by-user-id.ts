import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthDevicesQueryRepository } from 'src/features/auth/infrastructure/auth-devices-query-repository';
import { JwtService } from '@nestjs/jwt';
import { decodeToken } from 'src/utils';

export class GetUserDevicesByUserIdCommand {
  constructor(public refreshToken: string) {}
}

@CommandHandler(GetUserDevicesByUserIdCommand)
export class GetUserDevicesByUserIdHandler
  implements ICommandHandler<GetUserDevicesByUserIdCommand>
{
  constructor(
    protected authDevicesQueryRepository: AuthDevicesQueryRepository,
    protected jwtService: JwtService,
  ) {}

  async execute({ refreshToken }: GetUserDevicesByUserIdCommand) {
    const { sub } = decodeToken(refreshToken);
    return await this.authDevicesQueryRepository.getDevicesByUserId(sub);
  }
}
