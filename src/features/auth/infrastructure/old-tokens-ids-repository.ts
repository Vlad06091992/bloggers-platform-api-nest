import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  OldTokensIds,
  OldTokensIdsModel,
} from 'src/features/auth/domain/old-tokens-id-schema';

@Injectable()
export class OldTokensIdsRepository {
  constructor(
    @InjectModel(OldTokensIds.name)
    private oldTokensIdsModel: OldTokensIdsModel,
  ) {}

  createRecord(tokenId: string) {
    return this.oldTokensIdsModel.create({ expiredTokenId: tokenId });
  }

  clearData() {
    return this.oldTokensIdsModel.deleteMany();
  }
}
