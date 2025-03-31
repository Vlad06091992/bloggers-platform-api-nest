import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { PlayerEntity } from './player.entity';
import { UsersEntity } from '../../users/entities/users.entity';
import { GameEntity } from '../../quiz/entities/game.entity';

@Entity({ name: 'GameResult' })
export class GameResultEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ nullable: true })
  isDraw: boolean;

  @OneToOne(() => GameEntity, (g) => g.gameResult, { nullable: true })
  @JoinColumn()
  game: GameEntity | null;

  @OneToOne(() => PlayerEntity, (p) => p.id, { nullable: true })
  @JoinColumn()
  winnerPlayer: PlayerEntity | null;

  @OneToOne(() => PlayerEntity, (p) => p.id, { nullable: true })
  @JoinColumn()
  loserPlayer: PlayerEntity | null;

  @ManyToOne(() => UsersEntity, (p) => p.id, { nullable: true })
  loserUser: UsersEntity | null;

  @ManyToOne(() => UsersEntity, (p) => p.id, { nullable: true })
  winnerUser: UsersEntity | null;

  constructor(
    id: string,
    game: GameEntity | null,
    winnerPlayer: PlayerEntity | null,
    winnerUser: UsersEntity | null,
    loserPlayer: PlayerEntity | null,
    loserUser: UsersEntity | null,
    isDraw: boolean,
  ) {
    this.id = id;
    this.game = game;
    this.winnerPlayer = winnerPlayer;
    this.winnerUser = winnerUser;
    this.loserPlayer = loserPlayer;
    this.loserUser = loserUser;
    this.isDraw = isDraw;
  }
}
