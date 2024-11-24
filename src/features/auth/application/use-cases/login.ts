import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersEntity } from 'src/features/users/entities/users.entity';
import { GenerateJWTCommand } from 'src/features/auth/application/use-cases/generate-jwt';
import { generateUuidV4 } from 'src/utils';

export class LoginCommand {
  constructor(
    public user: UsersEntity,
    public deviceId: string,
  ) {}
}

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(protected commandBus: CommandBus) {}

  async execute({ user, deviceId }: LoginCommand) {
    const tokenId = generateUuidV4();

    const payload = {
      userLogin: user.login,
      sub: user.id,
      deviceId,
      tokenId,
    };
    return {
      accessToken: await this.commandBus.execute(
        new GenerateJWTCommand(payload, '10h'),
      ),
      refreshToken: await this.commandBus.execute(
        new GenerateJWTCommand(payload, '20h'),
      ),
    };
  }
}
