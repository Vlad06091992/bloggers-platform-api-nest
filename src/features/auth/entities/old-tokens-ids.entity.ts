import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'OldTokenIds' })
export class OldTokensIdsEntity {
  @PrimaryColumn()
  expiredTokenId: string;
  constructor(expiredTokenId: string) {
    this.expiredTokenId = expiredTokenId;
  }
}
