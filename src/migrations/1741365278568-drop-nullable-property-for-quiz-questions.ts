import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropNullablePropertyForQuizQuestions1741365278568
  implements MigrationInterface
{
  name = 'DropNullablePropertyForQuizQuestions1741365278568';

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
