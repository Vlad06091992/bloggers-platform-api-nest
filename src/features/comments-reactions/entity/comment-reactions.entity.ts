import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UsersEntity } from '../../users/entities/users.entity';
import { CommentsEntity } from '../../comments/entity/comments.entity';

@Entity({ name: 'CommentsReactions' })
export class CommentsReactions {
  @PrimaryColumn()
  id: string;

  @Column()
  likeStatus: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  addedAt: Date;

  @ManyToOne(() => UsersEntity)
  @JoinColumn()
  user: UsersEntity;

  @ManyToOne(() => CommentsEntity, (c) => c.commentsReactions)
  comment: CommentsEntity;
  constructor(
    id: string,
    likeStatus: string,
    addedAt: Date,
    user: UsersEntity,
    comment: CommentsEntity,
  ) {
    this.id = id;
    this.likeStatus = likeStatus;
    this.addedAt = addedAt;
    this.user = user;
    this.comment = comment;
  }
}
