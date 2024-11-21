import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { PostsEntity } from '../../posts/entity/posts.entity';
import { UsersEntity } from '../../users/entities/users.entity';
import { CommentsReactions } from '../../comments-reactions/entity/comment-reactions.entity';

@Entity({ name: 'Comments' })
export class CommentsEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => PostsEntity, { cascade: true, onDelete: 'CASCADE' })
  post: PostsEntity;

  @ManyToOne(() => UsersEntity, { cascade: true, onDelete: 'CASCADE' })
  user: UsersEntity;

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
    post: PostsEntity,
    user: UsersEntity,
    createdAt: Date,
  ) {
    this.id = id;
    this.content = content;
    this.post = post;
    this.user = user;
    this.createdAt = createdAt;
  }
}
