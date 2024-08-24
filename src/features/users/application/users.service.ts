import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/features/users/api/models/create-user.dto';
import { RegistrationData, User } from 'src/features/users/domain/user-schema';
import { UsersRepository } from 'src/features/users/infrastructure/users-repository';
import * as bcrypt from 'bcrypt';
import { UsersQueryRepository } from 'src/features/users/infrastructure/users.query-repository';
import { RequiredParamsValuesForUsers } from 'src/shared/common-types';
import { EmailService } from 'src/email/email.service';
import { add, isBefore } from 'date-fns';
import { RecoveryPasswordQueryRepository } from 'src/features/auth/infrastructure/recovery-password-query-repository';
import { generateUuid } from 'src/utils';

@Injectable()
export class UsersService {
  constructor(
    @Inject() protected usersRepository: UsersRepository,
    @Inject() protected usersQueryRepository: UsersQueryRepository,
    @Inject() protected emailService: EmailService,
    @Inject()
    protected recoveryPasswordQueryRepository: RecoveryPasswordQueryRepository,
  ) {}
  async create(createUserDto: CreateUserDto, isRegistration: boolean = false) {
    const id = generateUuid();
    const confirmationCode = generateUuid();

    const newUser: User = {
      createdAt: new Date().toISOString(),
      id,
      email: createUserDto.email,
      login: createUserDto.login,
      password: await this.createHash(createUserDto.password),
    };

    const registrationData: RegistrationData = {
      userId: id,
      expirationDate: add(new Date(), { hours: 1 }),
      confirmationCode: confirmationCode,
      isConfirmed: !isRegistration,
    };

    if (isRegistration) {
      await this.emailService.registrationConfirmation(
        createUserDto.email,
        confirmationCode,
      );
    }

    return await this.usersRepository.createUser({ newUser, registrationData });
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
    const extendedUser = await this.usersQueryRepository.getUserById(id, true);
    return {
      id: extendedUser.id,
      login: extendedUser.login,
      email: extendedUser.email,
      createdAt: extendedUser.createdAt,
    };
  }

  async confirmUserByConfirmationCode(code: string) {
    const user =
      await this.usersQueryRepository.findUserByConfirmationCode(code);

    if (!user) {
      throw new BadRequestException({
        errorsMessages: [{ message: 'user not found', field: 'code' }],
      });
    }

    if (user.registrationData.isConfirmed)
      throw new BadRequestException({
        errorsMessages: [{ message: 'code is confirmed', field: 'code' }],
      });

    if (isBefore(user.registrationData.expirationDate, new Date()))
      throw new BadRequestException({
        errorsMessages: [{ message: 'code is expired', field: 'code' }],
      });

    return this.usersRepository.confirmUserByUserId(user.id);
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
