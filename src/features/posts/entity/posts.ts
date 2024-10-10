import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { pagination } from 'src/utils';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Blogs } from 'src/features/blogs/entity/blogs';

@Schema({ _id: false })
export class Like {
  @Prop({ required: true })
  addedAt: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  login: string;
}

@Schema({ _id: false })
export class ExtendedLikesInfo {
  @Prop({ default: 0, required: true })
  likesCount: number;

  @Prop({ default: 0, required: true })
  dislikesCount: number;

  @Prop({ required: true })
  myStatus: string;

  @Prop({ required: true, default: [], type: [Like] })
  newestLikes: Like[];
}

@Entity({ name: 'Posts' })
export class Posts {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  shortDescription: string;

  @Column()
  content: string;

  @ManyToOne(() => Blogs, { cascade: true, onDelete: 'CASCADE' })
  blog: Blogs;

  @Column()
  blogName: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  constructor(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blog: Blogs,
    blogName: string,
    createdAt: Date,
  ) {
    this.id = id;
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blog = blog;
    this.blogName = blogName;
    this.createdAt = createdAt;
  }
}
