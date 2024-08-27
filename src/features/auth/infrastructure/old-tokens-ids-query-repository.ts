import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class OldTokensIdsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getOldTokenById(tokenId: string) {
    const query = `
    SELECT "OldTokenId"
    FROM public."OldTokensIds"
    WHERE "OldTokenId" = $1
    `;
    return (await this.dataSource.query(query, [tokenId])).length > 0;
  }
}
