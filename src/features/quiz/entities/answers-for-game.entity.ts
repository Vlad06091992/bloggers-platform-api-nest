import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PlayerEntity } from '../entities/player.entity';
import { QuizQuestionsEntity } from '../../quizQuestions/entity/quiz-questions.entity';
import { GameEntity } from '../../../features/quiz/entities/game.entity';

@Entity({ name: 'AnswersForGameEntity' })
export class AnswersForGameEntity {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => PlayerEntity)
  player: PlayerEntity;

  @ManyToOne(() => QuizQuestionsEntity, (p) => p.id)
  question: QuizQuestionsEntity;

  @ManyToOne(() => GameEntity, (g) => g.id)
  @JoinColumn()
  game: GameEntity | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: 'notAnswered' })
  playerResponseStatus: string;

  @Column()
  answer: string;

  constructor(
    id: string,
    player,
    question,
    playerResponseStatus,
    createdAt: Date,
    answer: string,
    game: GameEntity | null,
  ) {
    this.id = id;
    this.question = question;
    this.player = player;
    this.createdAt = createdAt;
    this.playerResponseStatus = playerResponseStatus;
    this.answer = answer;
    this.game = game;
  }
}
