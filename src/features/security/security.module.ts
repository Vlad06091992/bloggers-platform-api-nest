import { Module } from '@nestjs/common';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';

import { GetUserDevicesByUserIdHandler } from 'src/features/security/application/use-cases/get-devices-by-user-id';
import { AuthDevicesQueryRepository } from 'src/features/auth/infrastructure/auth-devices-query-repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SecurityController } from 'src/features/security/api/security-controller';
import { DeleteOtherDevicesHandler } from 'src/features/security/application/use-cases/delete-other-devices';
import { AuthDevicesRepository } from 'src/features/auth/infrastructure/auth-devices-repository';
import { DeleteSessionHandler } from 'src/features/security/application/use-cases/delete-session';
import { OldTokensIdsQueryRepository } from 'src/features/auth/infrastructure/old-tokens-ids-query-repository';
import { OldTokensIdsRepository } from 'src/features/auth/infrastructure/old-tokens-ids-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OldTokensIdsEntity } from 'src/features/auth/entities/old-tokens-ids.entity';
import { AuthDevices } from 'src/features/auth/entities/devices.entity';
import { IsActiveDeviceHandler } from 'src/features/auth/application/use-cases/is-active-device';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([OldTokensIdsEntity, AuthDevices]),
  ],
  controllers: [SecurityController],
  providers: [
    IsActiveDeviceHandler,
    GetUserDevicesByUserIdHandler,
    DeleteOtherDevicesHandler,
    DeleteSessionHandler,
    AuthDevicesQueryRepository,
    OldTokensIdsRepository,
    OldTokensIdsQueryRepository,
    AuthDevicesRepository,
    JwtService,
    ConfigService,
  ],
})
export class SecurityModule {}
