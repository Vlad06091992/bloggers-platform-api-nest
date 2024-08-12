import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RecoveryPasswordQueryRepository } from 'src/features/auth/infrastructure/recovery-password-query-repository';
import { BadRequestException } from '@nestjs/common';
import { UsersRepository } from 'src/features/users/infrastructure/users-repository';
import { UsersService } from 'src/features/users/application/users.service';

export class UpdateUserPasswordCommand {
  constructor(
    public recoveryCode: string,
    public newPassword: string,
  ) {}
}

@CommandHandler(UpdateUserPasswordCommand)
export class UpdateUserPasswordHandler
  implements ICommandHandler<UpdateUserPasswordCommand>
{
  constructor(
    protected recoveryPasswordQueryRepository: RecoveryPasswordQueryRepository,
    protected usersRepository: UsersRepository,
    protected usersService: UsersService,
  ) {}

  async execute({ recoveryCode, newPassword }: UpdateUserPasswordCommand) {
    const record =
      await this.recoveryPasswordQueryRepository.findUserByRecoveryCode(
        recoveryCode,
      );
    const userId = record?.userId;

    if (!userId) {
      throw new BadRequestException([
        { message: 'not found user by code', field: 'code' },
      ]);
    }

    const passwordHash = await this.usersService.createHash(newPassword);

    return await this.usersRepository.updateUserPassword(userId, passwordHash);
  }
}
