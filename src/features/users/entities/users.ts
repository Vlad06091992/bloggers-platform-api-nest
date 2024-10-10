import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UsersRegistrationData } from 'src/features/users/entities/users-registration-data';

@Entity({ name: 'Users' })
export class Users {
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
    () => UsersRegistrationData,
    (userRegData: UsersRegistrationData) => userRegData.user,
  )
  userRegistrationData: UsersRegistrationData;
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
