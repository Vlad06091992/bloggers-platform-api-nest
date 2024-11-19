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

  @ManyToOne(() => Users)
  @JoinColumn()
  user: Users;

  @ManyToOne(() => Posts, (post) => post.postReactions)
  post: Posts;
  constructor(
    id: string,
    likeStatus: string,
    addedAt: Date,
    // login: string,
    user: Users,
    post: Posts,
  ) {
    this.id = id;
    this.likeStatus = likeStatus;
    this.addedAt = addedAt;
    // this.login = login;
    this.user = user; // добавляем свойства user
    this.post = post; // добавляем свойства post
  }
}
