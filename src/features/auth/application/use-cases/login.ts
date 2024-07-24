import { Inject } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/features/users/domain/user-schema';
import { GenerateJWTCommand } from 'src/features/auth/application/use-cases/generate-jwt';

export class LoginCommand {
  constructor(public user: User) {}
}

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(protected commandBus: CommandBus) {}

  async execute({ user }: LoginCommand) {
    const payload = { username: user.login, sub: user.id };
    return {
      accessToken: await this.commandBus.execute(
        new GenerateJWTCommand(payload, '10m'),
      ),
    };
  }
}
