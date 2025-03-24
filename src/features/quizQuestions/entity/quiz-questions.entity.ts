import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'QuizQuestions' })
export class QuizQuestionsEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  body: string;

  @Column({ default: false })
  published: boolean;

  @Column({ type: 'jsonb' })
  correctAnswers: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    nullable: true,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  constructor(
    id: string,
    body: string,
    correctAnswers: string[],
    createdAt: Date,
    updatedAt: Date | null,
  ) {
    this.id = id;
    this.body = body;
    this.published = false;
    this.correctAnswers = correctAnswers;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
