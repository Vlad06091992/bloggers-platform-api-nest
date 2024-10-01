import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserRegistrationData } from 'src/features/users/entities/user-registration-data';

@Entity({ name: 'User' })
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  login: string;

  @Column()
  createdAt: Date;

  @Column()
  password: string;

  @OneToOne(
    () => UserRegistrationData,
    (userRegData: UserRegistrationData) => userRegData.user,
  )
  userRegistrationData: UserRegistrationData;
  constructor(
    id: string,
    email: string,
    login: string,
    createdAt: Date,
    password: string,
  ) {
    this.id = id;
    this.email = email;
    this.login = login;
    this.createdAt = createdAt;
    this.password = password;
  }
}
