import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { PlayerEntity } from '../entities/player.entity';
import { QuestionsForGameEntity } from '../../quiz/entities/questions-for-game.entity';
import { GameResultEntity } from '../../quiz/entities/game_result.entity';

@Entity({ name: 'Game' })
export class GameEntity {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => PlayerEntity, (p) => p.id, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  player1: PlayerEntity | null;

  @OneToOne(() => PlayerEntity, (p) => p.id, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  player2: PlayerEntity | null;

  @OneToOne(() => GameResultEntity, (g) => g.id, {
    nullable: true,
  })
  @JoinColumn()
  gameResult: GameResultEntity | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => QuestionsForGameEntity, (q) => q.game)
  questions: QuestionsForGameEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startGameDate: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  finishGameDate: Date;

  @Column({ default: 'active' })
  status: string;

  constructor(id: string, player1, player2, status) {
    this.id = id;
    this.player1 = player1;
    this.player2 = player2;
    this.status = status;
  }
}
