import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateJWTCommand } from 'src/features/auth/application/use-cases/generate-jwt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { decodeToken } from 'src/utils';
import { WriteOldTokenCommand } from 'src/features/auth/application/use-cases/write-old-token';

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
    const { userLogin, sub, deviceId, tokenId } = decodeToken(oldToken) || null;
    const payload = { userLogin, sub, deviceId };

    await this.commandBus.execute(new WriteOldTokenCommand(tokenId));

    return {
      accessToken: await this.commandBus.execute(
        new GenerateJWTCommand(payload, '10s'),
        // new GenerateJWTCommand(payload, '2 days'),
      ),
      refreshToken: await this.commandBus.execute(
        new GenerateJWTCommand(payload, '20s'),
        // new GenerateJWTCommand(payload, '2 days'),
      ),
    };
  }
}
