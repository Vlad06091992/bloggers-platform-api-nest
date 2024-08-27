import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class OldTokensIdsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  createRecord(tokenId: string) {
    const query = `
      INSERT INTO public."OldTokensIds"(
      "OldTokenId")
       VALUES ($1);
       `;
    return this.dataSource.query(query, [tokenId]);
  }

  clearData() {
    const query = `TRUNCATE TABLE public."OldTokensIds"`;
    return this.dataSource.query(query, []);
  }
}
