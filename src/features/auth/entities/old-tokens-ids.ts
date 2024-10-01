import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'OldTokenIds' })
export class OldTokensIds {
  @PrimaryColumn()
  expiredTokenId: string;
  constructor(expiredTokenId: string) {
    this.expiredTokenId = expiredTokenId;
  }
}
