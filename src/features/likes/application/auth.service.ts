import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/features/users/application/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { RecoveryPasswordRepository } from 'src/features/auth/infrastructure/recovery-password-repository';
import { RecoveryPasswordQueryRepository } from 'src/features/auth/infrastructure/recovery-password-query-repository';
import { UsersRepository } from 'src/features/users/infrastructure/users-repository';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class AuthService {
  constructor(
    private commandBus: CommandBus,
    private usersService: UsersService,
    private emailService: EmailService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private recoveryPasswordRepository: RecoveryPasswordRepository,
    private usersRepository: UsersRepository,
    private recoveryPasswordQueryRepository: RecoveryPasswordQueryRepository,
  ) {}

  // async login(user: User) {
  //   const payload = { username: user.login, sub: user.id };
  //   return {
  //     accessToken: await this.commandBus.execute(
  //       new GenerateJWTCommand(payload, '10m'),
  //     ),
  //   };
  // }

  // async recoveryPassword(email: string) {
  //   const user = await this.usersService.findUserByEmailOrLogin(email);
  //
  //   if (user) {
  //     const recoveryCode = uuidv4();
  //     await this.emailService.recoveryPassword(email, recoveryCode);
  //     const _id = new ObjectId();
  //
  //     const record: RecoveryPasswordsCode = {
  //       _id,
  //       id: _id.toString(),
  //       recoveryCode,
  //       email: user.email,
  //       expirationDate: add(new Date(), { hours: 1 }),
  //       userId: user.id,
  //     };
  //
  //     await this.recoveryPasswordRepository.createRecord(record);
  //
  //     await this.emailService.recoveryPassword(user.email, recoveryCode);
  //
  //     return true;
  //   }
  //
  //   return false;
  // }

  // async resendEmail(email: string) {
  //   const user = await this.usersService.findUserByEmail(email);
  //
  //   if (!user) {
  //     throw new BadRequestException({
  //       errorsMessages: [{ message: 'user not exist', field: 'email' }],
  //     });
  //   }
  //
  //   if (user.registrationData.isConfirmed) {
  //     throw new BadRequestException({
  //       errorsMessages: [
  //         { message: 'email already confirmed', field: 'email' },
  //       ],
  //     });
  //   }
  //
  //   if (user) {
  //     const confirmationCode = uuidv4();
  //     await this.usersService.updateConfirmationCode(user.id, confirmationCode);
  //     await this.emailService.registrationConfirmation(email, confirmationCode);
  //   }
  // }

  // async getMe(userId: string) {
  //   const user = (await this.usersService.findOne(userId))!;
  //
  //   return {
  //     email: user.email,
  //     login: user.login,
  //     userId,
  //   };
  // }
  // async findUserByRecoveryCode(recoveryCode: string) {
  //   return await this.recoveryPasswordQueryRepository.findUserByRecoveryCode(
  //     recoveryCode,
  //   );
  // }

  // async updateUserPassword(newPasswordDto: NewPasswordDto) {
  //   const record =
  //     await this.recoveryPasswordQueryRepository.findUserByRecoveryCode(
  //       newPasswordDto.recoveryCode,
  //     );
  //   const userId = record?.userId;
  //
  //   if (!userId) {
  //     throw new BadRequestException([
  //       { message: 'not found user by code', field: 'code' },
  //     ]);
  //   }
  //
  //   const passwordHash = await this.usersService.createHash(
  //     newPasswordDto.newPassword,
  //   );
  //
  //   return await this.usersRepository.updateUserPassword(userId, passwordHash);
  // }

  // async confirmEmail(code: string) {
  //   await this.usersService.confirmUserByConfirmationCode(code);
  //   return true;
  // }
}
