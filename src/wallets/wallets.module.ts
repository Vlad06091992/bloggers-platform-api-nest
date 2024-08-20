import { Module } from '@nestjs/common';
import { WalletsRepository } from 'src/wallets/wallets-repository.service';
import { WalletsController } from './wallets.controller';

@Module({
  controllers: [WalletsController],
  providers: [WalletsRepository],
})
export class WalletsModule {}
