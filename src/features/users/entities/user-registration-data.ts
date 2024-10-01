import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from 'src/features/users/entities/user';

@Entity({ name: 'UserRegistrationData' })
export class UserRegistrationData {
  @PrimaryColumn()
  id: string;

  @OneToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

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
    user: User,
  ) {
    this.id = id;
    this.isConfirmed = isConfirmed;
    this.confirmationCode = confirmationCode;
    this.expirationDate = expirationDate;
    this.user = user;
  }
}
