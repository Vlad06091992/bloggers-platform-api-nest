import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { UsersRegistrationDataEntity } from './users-registration-data.entity';

@Entity({ name: 'Users' })
export class UsersEntity {
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
    () => UsersRegistrationDataEntity,
    (userRegData: UsersRegistrationDataEntity) => userRegData.user,
  )
  userRegistrationData: UsersRegistrationDataEntity;
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
