import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  OldTokensIds,
  OldTokensIdsModel,
} from 'src/features/auth/domain/old-tokens-id-schema';

@Injectable()
export class OldTokensIdsQueryRepository {
  constructor(
    @InjectModel(OldTokensIds.name)
    private oldTokensIdsModel: OldTokensIdsModel,
  ) {}

  getOldTokenById(tokenId: string) {
    return this.oldTokensIdsModel.findOne({ expiredTokenId: tokenId });
  }
}
