import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PostsEntity } from '../../posts/entity/posts.entity';
import { UsersEntity } from '../../users/entities/users.entity';

@Entity({ name: 'PostsReactions' })
export class PostsReactions {
  @PrimaryColumn()
  id: string;

  @Column()
  likeStatus: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  addedAt: Date;

  // @Column()
  // login: string;

  @ManyToOne(() => UsersEntity)
  @JoinColumn()
  user: UsersEntity;

  @ManyToOne(() => PostsEntity, (post) => post.postReactions)
  post: PostsEntity;
  constructor(
    id: string,
    likeStatus: string,
    addedAt: Date,
    // login: string,
    user: UsersEntity,
    post: PostsEntity,
  ) {
    this.id = id;
    this.likeStatus = likeStatus;
    this.addedAt = addedAt;
    // this.login = login;
    this.user = user; // добавляем свойства user
    this.post = post; // добавляем свойства post
  }
}
