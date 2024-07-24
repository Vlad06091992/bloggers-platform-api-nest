import { Inject } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/features/users/domain/user-schema';
import { GenerateJWTCommand } from 'src/features/auth/application/use-cases/generate-jwt';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import { RecoveryPasswordsCode } from 'src/features/auth/domain/recovery-password-schema';
import { add } from 'date-fns';
import { RecoveryPasswordRepository } from 'src/features/auth/infrastructure/recovery-password-repository';
import { EmailService } from 'src/email/email.service';
import { UsersService } from 'src/features/users/application/users.service';

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
      const recoveryCode = uuidv4();
      await this.emailService.recoveryPassword(email, recoveryCode);
      const _id = new ObjectId();

      const record: RecoveryPasswordsCode = {
        _id,
        id: _id.toString(),
        recoveryCode,
        email: user.email,
        expirationDate: add(new Date(), { hours: 1 }),
        userId: user.id,
      };

      await this.recoveryPasswordRepository.createRecord(record);

      await this.emailService.recoveryPassword(user.email, recoveryCode);

      return true;
    }

    return false;
  }
}
