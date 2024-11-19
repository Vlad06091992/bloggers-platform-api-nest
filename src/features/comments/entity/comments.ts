import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Posts } from 'src/features/posts/entity/posts';
import { Users } from 'src/features/users/entities/users';
import { PostsReactions } from 'src/features/posts-reactions/entity/post-reactions';
import { CommentsReactions } from 'src/features/comments-reactions/entity/comment-reactions';

@Entity({ name: 'Comments' })
export class Comments {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => Posts, { cascade: true, onDelete: 'CASCADE' })
  post: Posts;

  @ManyToOne(() => Users, { cascade: true, onDelete: 'CASCADE' })
  user: Users;

  @OneToMany(
    () => CommentsReactions,
    (commentsReactions) => {
      return commentsReactions.comment;
    },
    { cascade: true, onDelete: 'CASCADE' },
  )
  commentsReactions: CommentsReactions[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  constructor(
    id: string,
    content: string,
    post: Posts,
    user: Users,
    createdAt: Date,
  ) {
    this.id = id;
    this.content = content;
    this.post = post;
    this.user = user;
    this.createdAt = createdAt;
  }
}
