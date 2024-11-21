import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/features/users/api/models/create-user.dto';
import { UsersEntity } from 'src/features/users/entities/users.entity';
import { UsersRepository } from 'src/features/users/infrastructure/users-repository';
import * as bcrypt from 'bcrypt';
import { UsersQueryRepository } from 'src/features/users/infrastructure/users.query-repository';
import { RequiredParamsValuesForUsers } from 'src/shared/common-types';
import { EmailService } from 'src/email/email.service';
import { add, isBefore } from 'date-fns';
import { RecoveryPasswordQueryRepository } from 'src/features/auth/infrastructure/recovery-password-query-repository';
import { generateUuidV4 } from 'src/utils';
import { UsersRegistrationDataEntity } from 'src/features/users/entities/users-registration-data.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject() protected usersRepository: UsersRepository,
    @Inject() protected usersQueryRepository: UsersQueryRepository,
    @Inject() protected emailService: EmailService,
    @Inject()
    protected recoveryPasswordQueryRepository: RecoveryPasswordQueryRepository,
  ) {}
  async create(
    { login, password, email }: CreateUserDto,
    isRegistration: boolean = false,
  ) {
    const id = generateUuidV4();
    const confirmationCode = generateUuidV4();
    const regDataId = generateUuidV4();
    const newUser = new UsersEntity(
      id,
      email,
      login,
      new Date(),
      await this.createHash(password),
    );
    const expirationDate = add(new Date(), { hours: 1 });
    const newUserRegistrationData = new UsersRegistrationDataEntity(
      regDataId,
      !isRegistration,
      confirmationCode,
      expirationDate,
      newUser,
    );
    if (isRegistration) {
      await this.emailService.registrationConfirmation(email, confirmationCode);
    }
    return await this.usersRepository.createUser({
      newUser,
      newUserRegistrationData,
    });
  }

  async findAll(params: RequiredParamsValuesForUsers) {
    return await this.usersQueryRepository.findAll(params);
  }

  async createHash(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(bodyPassword: string, password: string) {
    return await bcrypt.compare(bodyPassword, password);
  }

  async findOne(id: string) {
    const extendedUser = await this.usersQueryRepository.getUserById(id);
    return extendedUser
      ? {
          id: extendedUser.id,
          login: extendedUser.login,
          email: extendedUser.email,
          createdAt: extendedUser.createdAt,
        }
      : null;
  }

  async confirmUserByConfirmationCode(code: string) {
    const userRegData =
      await this.usersQueryRepository.findUserByConfirmationCode(code);

    if (!userRegData) {
      throw new BadRequestException({
        errorsMessages: [{ message: 'user not found', field: 'code' }],
      });
    }

    if (userRegData.isConfirmed)
      throw new BadRequestException({
        errorsMessages: [{ message: 'code is confirmed', field: 'code' }],
      });

    if (isBefore(userRegData.expirationDate, new Date()))
      throw new BadRequestException({
        errorsMessages: [{ message: 'code is expired', field: 'code' }],
      });
    return this.usersRepository.confirmUserByUserId(userRegData.user.id);
  }

  async updateConfirmationCode(userId: string, confirmationCode: string) {
    return this.usersRepository.updateConfirmationCode(
      userId,
      confirmationCode,
    );
  }

  async findUserByEmailOrLogin(emailOrLogin: string) {
    return await this.usersQueryRepository.findUserByEmailOrLogin(emailOrLogin);
  }

  async findUserByEmail(email: string) {
    return await this.usersQueryRepository.findUserByEmail(email);
  }

  async findUserByLogin(login: string) {
    return await this.usersQueryRepository.findUserByLogin(login);
  }
  remove(id: string) {
    return this.usersRepository.removeUserById(id);
  }
}
