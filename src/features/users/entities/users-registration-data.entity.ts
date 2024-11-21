import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity({ name: 'UsersRegistrationData' })
export class UsersRegistrationDataEntity {
  @PrimaryColumn()
  id: string;

  @OneToOne(() => UsersEntity, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UsersEntity;

  @Column()
  confirmationCode: string;

  @Column()
  expirationDate: Date;

  @Column()
  isConfirmed: boolean;

  constructor(
    id,
    isConfirmed: boolean,
    confirmationCode: string,
    expirationDate: Date,
    user: UsersEntity,
  ) {
    this.id = id;
    this.isConfirmed = isConfirmed;
    this.confirmationCode = confirmationCode;
    this.expirationDate = expirationDate;
    this.user = user;
  }
}
