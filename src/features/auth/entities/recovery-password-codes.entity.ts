import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'RecoveryPasswordCodes' })
export class RecoveryPasswordCodesEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  email: string;

  @Column()
  recoveryCode: string;

  @Column()
  expirationDate: Date;
}
