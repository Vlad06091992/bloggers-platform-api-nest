import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  OldTokensIds,
  OldTokensIdsModel,
} from 'src/features/auth/domain/old-tokens-id-schema';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class OldTokensIdsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectModel(OldTokensIds.name)
    private oldTokensIdsModel: OldTokensIdsModel,
  ) {}

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
