import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Blogs' })
export class Blogs {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  websiteUrl: string;

  @Column()
  createdAt: Date;

  @Column()
  isMembership: boolean;
  constructor(
    id: string,
    createdAt: Date,
    isMembership: boolean,
    websiteUrl: string,
    name: string,
    description: string,
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.isMembership = isMembership;
    this.websiteUrl = websiteUrl;
    this.name = name;
    this.description = description;
  }
}
