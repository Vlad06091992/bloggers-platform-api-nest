import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from 'src/features/users/application/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/features/users/domain/user-schema';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { RecoveryPasswordRepository } from 'src/features/auth/infrastructure/recovery-password-repository';
import { v4 as uuidv4 } from 'uuid';
import { RecoveryPasswordsCode } from 'src/features/auth/domain/recovery-password-schema';
import { ObjectId } from 'mongodb';
import { add } from 'date-fns';
import { RecoveryPasswordQueryRepository } from 'src/features/auth/infrastructure/recovery-password-query-repository';
import { UsersRepository } from 'src/features/users/infrastructure/users-repository';
import { NewPasswordDto } from 'src/features/auth/api/models/new-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private emailService: EmailService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private recoveryPasswordRepository: RecoveryPasswordRepository,
    private usersRepository: UsersRepository,
    private recoveryPasswordQueryRepository: RecoveryPasswordQueryRepository,
  ) {}

  async validateUser(loginOrEmail: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByEmailOrLogin(loginOrEmail);

    // if (!user)
    //   throw new BadRequestException({
    //     errorsMessages: [
    //       {
    //         message: 'user not found',
    //         field: 'emailOrLogin',
    //       },
    //     ],
    //   });


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

  generateJWT(payload: any, expiresIn: string) {
    return this.jwtService.sign(payload, {
      expiresIn,
      secret: this.configService.get('SECRET_KEY'),
    });
  }

  async login(user: User) {
    const payload = { username: user.login, sub: user.id };
    return {
      accessToken: this.generateJWT(payload, '10m'),
      // refreshToken: this.generateJWT(payload, '20m'),
    };
  }

  async recoveryPassword(email: string) {
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

  async resendEmail(email: string) {
    const user = await this.usersService.findUserByEmail(email);

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

  async getMe(userId: string) {
    const user = (await this.usersService.findOne(userId))!;

    return {
      email: user.email,
      login: user.login,
      userId,
    };
  }

  //   async changePassword(newPasswordDto: NewPasswordDto) {
  //
  //
  //
  //
  //     if (!userId) {
  //       throw new BadRequestException([
  //         { message: 'not found user by code', field: 'code' },
  //       ]);
  //     }
  //
  //     if(userId){
  // this.usersService.changePassword(userId, newPasswordDto.newPassword)
  //     }
  //     // await this.usersQueryRepository.findUserByConfirmationCode(code);
  //     //
  //     // if (!user) {
  //     //   throw new BadRequestException([
  //     //     { message: 'not found user by code', field: 'code' },
  //     //   ]);
  //     // }
  //     //
  //     // if (user.registrationData.isConfirmed)
  //     //   throw new BadRequestException([
  //     //     { message: 'code is confirmed', field: 'code' },
  //     //   ]);
  //     //
  //     // if (isBefore(user.registrationData.expirationDate, new Date()))
  //     //   throw new BadRequestException([
  //     //     { message: 'code is expired', field: 'code' },
  //     //   ]);
  //     //
  //     // return this.usersRepository.confirmUserByConfirmationCode(code);
  //   }

  async findUserByRecoveryCode(recoveryCode: string) {
    return await this.recoveryPasswordQueryRepository.findUserByRecoveryCode(
      recoveryCode,
    );
  }

  async updateUserPassword(newPasswordDto: NewPasswordDto) {
    const record =
      await this.recoveryPasswordQueryRepository.findUserByRecoveryCode(
        newPasswordDto.recoveryCode,
      );
    const userId = record?.userId;

    if (!userId) {
      throw new BadRequestException([
        { message: 'not found user by code', field: 'code' },
      ]);
    }

    const passwordHash = await this.usersService.createHash(
      newPasswordDto.newPassword,
    );

    return await this.usersRepository.updateUserPassword(userId, passwordHash);
  }

  async confirmEmail(code: string) {
    await this.usersService.confirmUserByConfirmationCode(code);
    return true;
  }
}
