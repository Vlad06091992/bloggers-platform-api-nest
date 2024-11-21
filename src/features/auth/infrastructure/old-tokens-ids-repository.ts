import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OldTokensIdsEntity } from 'src/features/auth/entities/old-tokens-ids.entity';

@Injectable()
export class OldTokensIdsRepository {
  constructor(
    @InjectRepository(OldTokensIdsEntity)
    private readonly repo: Repository<OldTokensIdsEntity>,
  ) {}

  async createRecord(tokenId: string) {
    const record = new OldTokensIdsEntity(tokenId);
    await this.repo.insert(record);
  }

  async clearData() {
    await this.repo.clear();
  }
}
