import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { PlayerEntity } from '../entities/player.entity';

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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  startGameDate: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  finishGameDate: Date;

  @Column({ default: 'active' })
  status: string;

  constructor(id: string, player1, player2, createdAt: Date, status) {
    this.id = id;
    this.player1 = player1;
    this.player2 = player2;
    this.createdAt = createdAt;
    this.status = status;
  }
}
