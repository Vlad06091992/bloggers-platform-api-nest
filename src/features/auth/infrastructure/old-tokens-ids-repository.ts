import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OldTokensIds } from 'src/features/auth/entities/old-tokens-ids';

@Injectable()
export class OldTokensIdsRepository {
  constructor(
    @InjectRepository(OldTokensIds)
    private readonly repo: Repository<OldTokensIds>,
  ) {}

  async createRecord(tokenId: string) {
    const record = new OldTokensIds(tokenId);
    await this.repo.insert(record);
  }

  async clearData() {
    await this.repo.clear();
  }
}
