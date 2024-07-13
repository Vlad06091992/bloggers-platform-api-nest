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
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { EmailService } from 'src/email/email.service';
import { RecoveryPasswordQueryRepository } from 'src/features/auth/infrastructure/recovery-password-query-repository';
import { RecoveryPasswordRepository } from 'src/features/auth/infrastructure/recovery-password-repository';
import {
  RecoveryPasswordsCode,
  RecoveryPasswordsCodesSchema,
} from 'src/features/auth/domain/recovery-password-schema';
import { BasicStrategy } from 'src/features/auth/strategies/auth-basic.strategy';

@Module({
  imports: [
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
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
