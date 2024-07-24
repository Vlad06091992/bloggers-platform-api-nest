import {
  BadRequestException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from 'src/features/users/application/users.service';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from 'src/email/email.service';

export class ResendEmailCommand {
  constructor(public email: string) {}
}

@CommandHandler(ResendEmailCommand)
export class ResendEmailHandler implements ICommandHandler<ResendEmailCommand> {
  constructor(
    @Inject() protected usersService: UsersService,
    @Inject() protected emailService: EmailService,
  ) {}

  async execute({ email }: ResendEmailCommand) {
    const user = await this.usersService.findUserByEmail(email);

    console.log(user);

    if (!user) {
      throw new BadRequestException({
        errorsMessages: [{ message: 'user not exist', field: 'email' }],
      });
    }

    if (user.registrationData.isConfirmed) {
      throw new BadRequestException({
        errorsMessages: [
          { message: 'email already confirmed', field: 'email' },
        ],
      });
    }

    if (user) {
      const confirmationCode = uuidv4();
      await this.usersService.updateConfirmationCode(user.id, confirmationCode);
      await this.emailService.registrationConfirmation(email, confirmationCode);
    }
  }
}
