import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { UsersEntity } from '../../users/entities/users.entity';
import { GameEntity } from '../../quiz/entities/game.entity';

@Entity({ name: 'Player' })
export class PlayerEntity {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => UsersEntity, (u) => u.id)
  user: UsersEntity;

  @ManyToOne(() => GameEntity, (g) => g.id)
  @JoinColumn()
  game: GameEntity | null;

  @Column({ default: 'pending' })
  status: string;

  @Column()
  userLogin: string;

  @Column({ default: 0 })
  score: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  constructor(
    id: string,
    status: string,
    game: GameEntity | null,
    createdAt: Date,
    user: UsersEntity,
    userLogin: string,
  ) {
    this.id = id;
    this.user = user;
    this.game = game;
    this.status = status;
    this.createdAt = createdAt;
    this.userLogin = userLogin;
  }
}
