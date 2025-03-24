import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropNotNullablePropertyQuestions1741364784585
  implements MigrationInterface
{
  name = 'DropNotNullablePropertyQuestions1741364784585';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "QuizQuestions" ALTER COLUMN "updatedAt" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "QuizQuestions" ALTER COLUMN "updatedAt" SET NOT NULL`,
    );
  }
}
