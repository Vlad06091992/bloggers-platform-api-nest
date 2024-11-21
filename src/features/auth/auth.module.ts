import { Module } from '@nestjs/common';
import { AuthService } from 'src/features/auth/application/auth.service';
import { AuthController } from 'src/features/auth/api/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/features/users/users.module';
import { LocalStrategy } from 'src/features/auth/strategies/local.strategy';
import { UsersService } from 'src/features/users/application/users.service';
import { UsersQueryRepository } from 'src/features/users/infrastructure/users.query-repository';
import { UsersRepository } from 'src/features/users/infrastructure/users-repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/features/auth/constants';
import { JwtStrategy } from 'src/features/auth/strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { RecoveryPasswordQueryRepository } from 'src/features/auth/infrastructure/recovery-password-query-repository';
import { RecoveryPasswordRepository } from 'src/features/auth/infrastructure/recovery-password-repository';
import { BasicStrategy } from 'src/features/auth/strategies/auth-basic.strategy';
import { CqrsModule } from '@nestjs/cqrs';
import { ValidateUserHandler } from 'src/features/auth/application/use-cases/validate-user';
import { GenerateJWTHandler } from 'src/features/auth/application/use-cases/generate-jwt';
import { LoginHandler } from 'src/features/auth/application/use-cases/login';
import { RecoveryPasswordHandler } from 'src/features/auth/application/use-cases/recovery-password';
import { ResendEmailHandler } from 'src/features/auth/application/use-cases/resend-email';
import { GetMeHandler } from 'src/features/auth/application/use-cases/get-me';
import { ConfirmEmailHandler } from 'src/features/auth/application/use-cases/confirm-email';
import { FindUserByRecoveryCodeHandler } from 'src/features/auth/application/use-cases/find-user-by-recovery-code';
import { UpdateUserPasswordHandler } from 'src/features/auth/application/use-cases/update-user-password';
import { RefreshJWTHandler } from 'src/features/auth/application/use-cases/refresh-tokens';
import { CreateSessionlHandler } from 'src/features/auth/application/use-cases/create-session';
import { AuthDevicesRepository } from 'src/features/auth/infrastructure/auth-devices-repository';
import { AuthDevicesQueryRepository } from 'src/features/auth/infrastructure/auth-devices-query-repository';
import { IsActiveDeviceHandler } from 'src/features/auth/application/use-cases/is-active-device';
import { LogoutHandler } from 'src/features/auth/application/use-cases/logout';
import { SecurityModule } from 'src/features/security/security.module';
import { WriteOldTokenHandler } from 'src/features/auth/application/use-cases/write-old-token';
import { IsOldTokenHandler } from 'src/features/auth/application/use-cases/is-old-token';
import { OldTokensIdsQueryRepository } from 'src/features/auth/infrastructure/old-tokens-ids-query-repository';
import { OldTokensIdsRepository } from 'src/features/auth/infrastructure/old-tokens-ids-repository';
import { UpdateSessionHandler } from 'src/features/security/application/use-cases/update-session';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OldTokensIdsEntity } from 'src/features/auth/entities/old-tokens-ids.entity';
import { AuthDevices } from 'src/features/auth/entities/devices.entity';
import { UsersEntity } from 'src/features/users/entities/users.entity';
import { UsersRegistrationDataEntity } from 'src/features/users/entities/users-registration-data.entity';
import { RecoveryPasswordCodesEntity } from 'src/features/auth/entities/recovery-password-codes.entity';

@Module({
  imports: [
    CqrsModule,
    SecurityModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
    TypeOrmModule.forFeature([
      OldTokensIdsEntity,
      AuthDevices,
      UsersEntity,
      UsersRegistrationDataEntity,
      RecoveryPasswordCodesEntity,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    EmailService,
    ConfigService,
    BasicStrategy,
    JwtStrategy,
    JwtService,
    AuthService,
    LocalStrategy,
    UsersService,
    UsersQueryRepository,
    AuthDevicesRepository,
    AuthDevicesQueryRepository,
    UsersRepository,
    RecoveryPasswordQueryRepository,
    RecoveryPasswordRepository,
    OldTokensIdsRepository,
    OldTokensIdsQueryRepository,
    ValidateUserHandler,
    FindUserByRecoveryCodeHandler,
    GenerateJWTHandler,
    LoginHandler,
    RecoveryPasswordHandler,
    UpdateUserPasswordHandler,
    ResendEmailHandler,
    GetMeHandler,
    ConfirmEmailHandler,
    RefreshJWTHandler,
    CreateSessionlHandler,
    IsActiveDeviceHandler,
    LoginHandler,
    LogoutHandler,
    WriteOldTokenHandler,
    IsOldTokenHandler,
    UpdateSessionHandler,
  ],
  exports: [AuthService],
})
export class AuthModule {}
