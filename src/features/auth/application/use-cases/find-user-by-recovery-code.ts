import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RecoveryPasswordQueryRepository } from 'src/features/auth/infrastructure/recovery-password-query-repository';

export class FindUserByRecoveryCodeCommand {
  constructor(public recoveryCode: string) {}
}

@CommandHandler(FindUserByRecoveryCodeCommand)
export class FindUserByRecoveryCodeHandler
  implements ICommandHandler<FindUserByRecoveryCodeCommand>
{
  constructor(
    protected recoveryPasswordQueryRepository: RecoveryPasswordQueryRepository,
  ) {}

  async execute({ recoveryCode }: FindUserByRecoveryCodeCommand) {
    return await this.recoveryPasswordQueryRepository.findUserByRecoveryCode(
      recoveryCode,
    );
  }
}
