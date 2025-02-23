import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { GameEntity } from '../entities/game.entity';
import { QuizQuestionsEntity } from '../../quizQuestions/entity/quiz-questions.entity';

@Entity({ name: 'QuestionsForGameEntity' })
export class QuestionsForGameEntity {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => GameEntity)
  game: GameEntity;

  @ManyToOne(() => QuizQuestionsEntity, (p) => p.id)
  question: QuizQuestionsEntity;

  @Column()
  position: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  constructor(id: string, game, question, createdAt: Date) {
    this.id = id;
    this.game = game;
    this.question = question;
    this.createdAt = createdAt;
  }
}
