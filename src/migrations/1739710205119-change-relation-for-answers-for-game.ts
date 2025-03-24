import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeRelationForAnswersForGame1739710205119
  implements MigrationInterface
{
  name = 'ChangeRelationForAnswersForGame1739710205119';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "AnswersForGameEntity" DROP CONSTRAINT "FK_bb86873b961969c7c2fd69ed6d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "AnswersForGameEntity" DROP CONSTRAINT "REL_bb86873b961969c7c2fd69ed6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "AnswersForGameEntity" ADD CONSTRAINT "FK_bb86873b961969c7c2fd69ed6d6" FOREIGN KEY ("questionId") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "AnswersForGameEntity" DROP CONSTRAINT "FK_bb86873b961969c7c2fd69ed6d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "AnswersForGameEntity" ADD CONSTRAINT "REL_bb86873b961969c7c2fd69ed6d" UNIQUE ("questionId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "AnswersForGameEntity" ADD CONSTRAINT "FK_bb86873b961969c7c2fd69ed6d6" FOREIGN KEY ("questionId") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
