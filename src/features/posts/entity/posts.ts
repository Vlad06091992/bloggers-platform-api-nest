import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Blogs } from 'src/features/blogs/entity/blogs';
import { PostsReactions } from 'src/features/posts-reactions/entity/post-reactions';

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
