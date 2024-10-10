import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Users } from 'src/features/users/entities/users';

@Entity({ name: 'UsersRegistrationData' })
export class UsersRegistrationData {
  @PrimaryColumn()
  id: string;

  @OneToOne(() => Users, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: Users;

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
    user: Users,
  ) {
    this.id = id;
    this.isConfirmed = isConfirmed;
    this.confirmationCode = confirmationCode;
    this.expirationDate = expirationDate;
    this.user = user;
  }
}
