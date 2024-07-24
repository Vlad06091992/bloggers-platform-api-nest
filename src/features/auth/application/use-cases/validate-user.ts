import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from 'src/features/users/application/users.service';

export class ValidateUserCommand {
  constructor(
    public loginOrEmail: string,
    public password: string,
  ) {}
}

@CommandHandler(ValidateUserCommand)
export class ValidateUserHandler
  implements ICommandHandler<ValidateUserCommand>
{
  constructor(@Inject() protected usersService: UsersService) {}

  async execute({ loginOrEmail, password }: ValidateUserCommand): Promise<any> {
    const user = await this.usersService.findUserByEmailOrLogin(loginOrEmail);

    if (!user)
      throw new UnauthorizedException({
        errorsMessages: [
          {
            message: 'user not found',
            field: 'emailOrLogin',
          },
        ],
      });

    const isValidPassword = await this.usersService.comparePassword(
      password,
      user!.password,
    );

    if (user && isValidPassword) {
      return user;
    }
    return null;
  }
}
