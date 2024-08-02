import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModule } from 'src/mongo-module/mongo.module';
import { CqrsModule } from '@nestjs/cqrs';

import { GetUserDevicesByUserIdHandler } from 'src/features/security/application/use-cases/get-devices-by-user-id';
import {
  AuthDevices,
  AuthDevicesSchema,
} from 'src/features/auth/domain/devices-schema';
import { AuthDevicesQueryRepository } from 'src/features/auth/infrastructure/auth-devices-query-repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SecurityController } from 'src/features/security/api/security-controller';
import {
  DeleteOtherDevicesCommand,
  DeleteOtherDevicesHandler,
} from 'src/features/security/application/use-cases/delete-other-devices';
import { AuthDevicesRepository } from 'src/features/auth/infrastructure/auth-devices-repository';
import { DeleteSessionHandler } from 'src/features/security/application/use-cases/delete-session';

@Module({
  imports: [
    CqrsModule,
    MongoModule,
    MongooseModule.forFeature([
      {
        name: AuthDevices.name,
        schema: AuthDevicesSchema,
      },
    ]),
  ],
  controllers: [SecurityController],
  providers: [
    GetUserDevicesByUserIdHandler,
    DeleteOtherDevicesHandler,
    DeleteSessionHandler,
    AuthDevicesQueryRepository,
    AuthDevicesRepository,
    JwtService,
    ConfigService,
  ],
})
export class SecurityModule {}
