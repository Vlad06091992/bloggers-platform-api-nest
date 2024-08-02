import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from 'src/features/users/application/users.service';

export class ConfirmEmailCommand {
  constructor(public recoveryCode: string) {}
}

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailHandler
  implements ICommandHandler<ConfirmEmailCommand>
{
  constructor(protected usersService: UsersService) {}

  async execute({ recoveryCode }: ConfirmEmailCommand) {
    await this.usersService.confirmUserByConfirmationCode(recoveryCode);
    return true;
  }
}
