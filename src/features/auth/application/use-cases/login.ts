import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from 'src/features/users/domain/user-schema';
import { GenerateJWTCommand } from 'src/features/auth/application/use-cases/generate-jwt';
import { v4 as uuidv4 } from 'uuid';
export class LoginCommand {
  constructor(
    public user: User,
    public deviceId: string,
  ) {}
}

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(protected commandBus: CommandBus) {}

  async execute({ user, deviceId }: LoginCommand) {
    const tokenId = uuidv4();

    const payload = {
      userLogin: user.login,
      sub: user.id,
      deviceId,
      tokenId,
    };
    return {
      accessToken: await this.commandBus.execute(
        new GenerateJWTCommand(payload, '10s'),
      ),
      refreshToken: await this.commandBus.execute(
        new GenerateJWTCommand(payload, '20s'),
      ),
    };
  }
}
