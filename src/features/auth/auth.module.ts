import { Module } from '@nestjs/common';
import { AuthService } from 'src/features/auth/application/auth.service';
import { AuthController } from 'src/features/auth/api/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/features/users/users.module';
import { LocalStrategy } from 'src/features/auth/strategies/local.strategy';
import { UsersService } from 'src/features/users/application/users.service';
import { UsersQueryRepository } from 'src/features/users/infrastructure/users.query-repository';
import { UsersRepository } from 'src/features/users/infrastructure/users-repository';
import { MongoModule } from 'src/mongo-module/mongo.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/features/users/domain/user-schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/features/auth/constants';
import { JwtStrategy } from 'src/features/auth/strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { RecoveryPasswordQueryRepository } from 'src/features/auth/infrastructure/recovery-password-query-repository';
import { RecoveryPasswordRepository } from 'src/features/auth/infrastructure/recovery-password-repository';
import {
  RecoveryPasswordsCode,
  RecoveryPasswordsCodesSchema,
} from 'src/features/auth/domain/recovery-password-schema';
import { BasicStrategy } from 'src/features/auth/strategies/auth-basic.strategy';
import { CqrsModule } from '@nestjs/cqrs';
import { ValidateUserHandler } from 'src/features/auth/application/use-cases/validate-user';
import { GenerateJWTHandler } from 'src/features/auth/application/use-cases/generate-jwt';
import { LoginHandler } from 'src/features/auth/application/use-cases/login';
import { RecoveryPasswordHandler } from 'src/features/auth/application/use-cases/recovery-password';
import { ResendEmailHandler } from 'src/features/auth/application/use-cases/resend-email';
import { GetMeHandler } from 'src/features/auth/application/use-cases/get-me';
import {
  ConfirmEmailCommand,
  ConfirmEmailHandler,
} from 'src/features/auth/application/use-cases/confirm-email';
import { FindUserByRecoveryCodeHandler } from 'src/features/auth/application/use-cases/find-user-by-recovery-code';
import { UpdateUserPasswordHandler } from 'src/features/auth/application/use-cases/update-user-password';

@Module({
  imports: [
    CqrsModule,
    UsersModule,
    PassportModule,
    MongoModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      {
        name: RecoveryPasswordsCode.name,
        schema: RecoveryPasswordsCodesSchema,
      },
    ]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
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
    UsersRepository,
    RecoveryPasswordQueryRepository,
    RecoveryPasswordRepository,
    ValidateUserHandler,
    FindUserByRecoveryCodeHandler,
    GenerateJWTHandler,
    LoginHandler,
    RecoveryPasswordHandler,
    UpdateUserPasswordHandler,
    ResendEmailHandler,
    GetMeHandler,
    ConfirmEmailHandler,
  ],
  exports: [AuthService],
})
export class AuthModule {}
