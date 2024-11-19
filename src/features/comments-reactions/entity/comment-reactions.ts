import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from 'src/features/users/entities/users';
import { Comments } from 'src/features/comments/entity/comments';

@Entity({ name: 'CommentsReactions' })
export class CommentsReactions {
  @PrimaryColumn()
  id: string;

  @Column()
  likeStatus: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  addedAt: Date;

  @ManyToOne(() => Users)
  @JoinColumn()
  user: Users;

  @ManyToOne(() => Comments, (c) => c.commentsReactions)
  comment: Comments;
  constructor(
    id: string,
    likeStatus: string,
    addedAt: Date,
    user: Users,
    comment: Comments,
  ) {
    this.id = id;
    this.likeStatus = likeStatus;
    this.addedAt = addedAt;
    this.user = user; // добавляем свойства user
    this.comment = comment; // добавляем свойства post
  }
}
