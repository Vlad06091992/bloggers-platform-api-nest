import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import { RecoveryPasswordsCode } from 'src/features/auth/domain/recovery-password-schema';
import { add, addHours } from 'date-fns';
import { RecoveryPasswordRepository } from 'src/features/auth/infrastructure/recovery-password-repository';
import { EmailService } from 'src/email/email.service';
import { UsersService } from 'src/features/users/application/users.service';
import { generateUuidV4 } from 'src/utils';

export class RecoveryPasswordCommand {
  constructor(public email: string) {}
}

@CommandHandler(RecoveryPasswordCommand)
export class RecoveryPasswordHandler
  implements ICommandHandler<RecoveryPasswordCommand>
{
  constructor(
    protected usersService: UsersService,
    protected emailService: EmailService,
    protected recoveryPasswordRepository: RecoveryPasswordRepository,
  ) {}

  async execute({ email }: RecoveryPasswordCommand) {
    const user = await this.usersService.findUserByEmailOrLogin(email);

    if (user) {
      const recoveryCode = generateUuidV4();
      const id = generateUuidV4();
      await this.emailService.recoveryPassword(email, recoveryCode);

      const record: RecoveryPasswordsCode = {
        id,
        recoveryCode,
        email: user.email,
        expirationDate: addHours(new Date(), 2),
        userId: user.id,
      };
      await this.recoveryPasswordRepository.createRecord(record);

      await this.emailService.recoveryPassword(user.email, recoveryCode);

      return true;
    }

    return false;
  }
}
