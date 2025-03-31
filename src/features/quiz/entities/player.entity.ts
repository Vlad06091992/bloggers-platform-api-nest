import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { UsersEntity } from '../../users/entities/users.entity';
import { GameEntity } from '../../quiz/entities/game.entity';
import { AnswersForGameEntity } from '../entities/answers-for-game.entity';

@Entity({ name: 'Player' })
export class PlayerEntity {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => UsersEntity, (u) => u.id)
  user: UsersEntity;

  @OneToMany(
    () => AnswersForGameEntity,
    (answersForGameEntity) => {
      return answersForGameEntity.player;
    },
    { cascade: true, onDelete: 'CASCADE' },
  )
  answers: AnswersForGameEntity[];

  @ManyToOne(() => GameEntity, (g) => g.id)
  @JoinColumn()
  game: GameEntity | null;

  @Column()
  userLogin: string;

  @Column({ default: 0 })
  score: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  constructor(
    id: string,
    game: GameEntity | null,
    createdAt: Date,
    user: UsersEntity,
    userLogin: string,
  ) {
    this.id = id;
    this.user = user;
    this.game = game;
    this.createdAt = createdAt;
    this.userLogin = userLogin;
  }
}
