import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { BlogsEntity } from '../../blogs/entity/blogs.entity';
import { PostsReactions } from '../../posts-reactions/entity/post-reactions.entity';

@Entity({ name: 'Posts' })
export class PostsEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  shortDescription: string;

  @Column()
  content: string;

  @ManyToOne(() => BlogsEntity, { cascade: true, onDelete: 'CASCADE' })
  blog: BlogsEntity;

  @OneToMany(
    () => PostsReactions,
    (postsReactions) => {
      return postsReactions.post;
    },
    { cascade: true, onDelete: 'CASCADE' },
  )
  postReactions: PostsReactions[];

  @Column()
  blogName: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  constructor(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blog: BlogsEntity,
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
