import { Module } from '@nestjs/common';
import { UsersService } from 'src/features/users/application/users.service';
import { UsersController } from 'src/features/users/api/users.controller';
import { UsersRepository } from 'src/features/users/infrastructure/users-repository';
import { UsersQueryRepository } from 'src/features/users/infrastructure/users.query-repository';
import { EmailService } from 'src/email/email.service';
import { RecoveryPasswordQueryRepository } from 'src/features/auth/infrastructure/recovery-password-query-repository';

@Module({
  imports: [],
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
