import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'AuthDevices' })
export class AuthDevices {
  @PrimaryColumn()
  id: string;

  @Column()
  ip: string;

  @Column()
  title: string;

  @Column()
  userId: string;

  @Column()
  deviceId: string;

  @Column()
  lastActiveDate: Date;

  @Column()
  isActive: boolean;

  constructor(
    ip: string,
    id: string,
    isActive: boolean,
    deviceId: string,
    userId: string,
    title: string,
    lastActiveDate: Date,
  ) {
    this.id = id;
    this.ip = ip;
    this.isActive = isActive;
    this.deviceId = deviceId;
    this.userId = userId;
    this.title = title;
    this.lastActiveDate = lastActiveDate;
  }
}
