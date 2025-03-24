import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeRelationForAnswersForGameEntity1739710562073
  implements MigrationInterface
{
  name = 'ChangeRelationForAnswersForGameEntity1739710562073';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "AnswersForGameEntity" DROP CONSTRAINT "FK_bb86873b961969c7c2fd69ed6d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "AnswersForGameEntity" ADD CONSTRAINT "FK_bb86873b961969c7c2fd69ed6d6" FOREIGN KEY ("questionId") REFERENCES "QuizQuestions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "AnswersForGameEntity" DROP CONSTRAINT "FK_bb86873b961969c7c2fd69ed6d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "AnswersForGameEntity" ADD CONSTRAINT "FK_bb86873b961969c7c2fd69ed6d6" FOREIGN KEY ("questionId") REFERENCES "QuestionsForGameEntity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
