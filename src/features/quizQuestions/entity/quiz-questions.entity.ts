import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'QuizQuestions' })
export class QuizQuestionsEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  body: string;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ type: 'jsonb' })
  correctAnswers: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  constructor(
    id: string,
    body: string,
    correctAnswers: string[],
    createdAt: Date,
  ) {
    this.id = id;
    this.body = body;
    this.isPublished = false;
    this.correctAnswers = correctAnswers;
    this.createdAt = createdAt;
    this.updatedAt = createdAt;
  }
}
