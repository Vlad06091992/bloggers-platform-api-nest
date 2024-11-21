import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OldTokensIdsEntity } from 'src/features/auth/entities/old-tokens-ids.entity';

@Injectable()
export class OldTokensIdsQueryRepository {
  constructor(
    @InjectRepository(OldTokensIdsEntity)
    private readonly repo: Repository<OldTokensIdsEntity>,
  ) {}

  async getOldTokenById(tokenId: string) {
    return await this.repo.findOne({ where: { expiredTokenId: tokenId } });
  }
}
