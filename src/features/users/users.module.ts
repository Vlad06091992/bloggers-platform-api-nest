import { Module } from '@nestjs/common';
import { UsersService } from 'src/features/users/application/users.service';
import { UsersController } from 'src/features/users/api/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/features/users/domain/user-schema';
import { UsersRepository } from 'src/features/users/infrastructure/users-repository';
import { UsersQueryRepository } from 'src/features/users/infrastructure/users.query-repository';
import { MongoModule } from 'src/mongo-module/mongo.module';
import { EmailService } from 'src/email/email.service';
import { RecoveryPasswordQueryRepository } from 'src/features/auth/infrastructure/recovery-password-query-repository';
import {
  RecoveryPasswordsCode,
  RecoveryPasswordsCodesSchema,
} from 'src/features/auth/domain/recovery-password-schema';

@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      {
        name: RecoveryPasswordsCode.name,
        schema: RecoveryPasswordsCodesSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    EmailService,
    RecoveryPasswordQueryRepository,
  ],
})
export class UsersModule {}
