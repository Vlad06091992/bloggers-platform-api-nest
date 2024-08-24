import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateJWTCommand } from 'src/features/auth/application/use-cases/generate-jwt';
import { JwtService } from '@nestjs/jwt';
import { decodeToken, generateUuid } from 'src/utils';
import { WriteOldTokenCommand } from 'src/features/auth/application/use-cases/write-old-token';
import { UpdateSessionComamnd } from 'src/features/security/application/use-cases/update-session';

export class RefreshJWTCommand {
  constructor(public oldToken: string) {}
}

@CommandHandler(RefreshJWTCommand)
export class RefreshJWTHandler implements ICommandHandler<RefreshJWTCommand> {
  constructor(
    protected commandBus: CommandBus,
    protected jwtService: JwtService,
  ) {}

  async execute({ oldToken }: RefreshJWTCommand) {
    const {
      userLogin,
      sub,
      deviceId,
      tokenId: oldTokenId,
    } = decodeToken(oldToken) || null;
    const newTokenId = generateUuid();

    const payload = { userLogin, sub, deviceId, tokenId: newTokenId };

    await this.commandBus.execute(new UpdateSessionComamnd(deviceId));
    await this.commandBus.execute(new WriteOldTokenCommand(oldTokenId));

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
