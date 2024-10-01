import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OldTokensIds } from 'src/features/auth/entities/old-tokens-ids';

@Injectable()
export class OldTokensIdsQueryRepository {
  constructor(
    @InjectRepository(OldTokensIds)
    private readonly repo: Repository<OldTokensIds>,
  ) {}

  async getOldTokenById(tokenId: string) {
    return await this.repo.findOne({ where: { expiredTokenId: tokenId } });
  }
}
