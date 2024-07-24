import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ValidateUserCommand } from 'src/features/auth/application/use-cases/validate-user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private commandBus: CommandBus) {
    super({ usernameField: 'loginOrEmail' });
    // super();
  }

  async validate(loginOrEmail: string, password: string): Promise<any> {
    const user = await this.commandBus.execute(
      new ValidateUserCommand(loginOrEmail, password),
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
