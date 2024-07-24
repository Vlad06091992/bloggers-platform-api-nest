import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from 'src/features/users/application/users.service';

export class GetMeCommand {
  constructor(public userId: string) {}
}

@CommandHandler(GetMeCommand)
export class GetMeHandler implements ICommandHandler<GetMeCommand> {
  constructor(@Inject() protected usersService: UsersService) {}

  async execute({ userId }: GetMeCommand) {
    const user = (await this.usersService.findOne(userId))!;

    return {
      email: user.email,
      login: user.login,
      userId,
    };
  }
}
