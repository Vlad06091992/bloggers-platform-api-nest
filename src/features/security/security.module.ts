import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

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

@Module({
  imports: [CqrsModule],
  controllers: [SecurityController],
  providers: [
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
