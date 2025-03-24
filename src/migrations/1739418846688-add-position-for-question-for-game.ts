import { MigrationInterface, QueryRunner } from 'typeorm';

export class CheckChanges1739418846688 implements MigrationInterface {
  name = 'CheckChanges1739418846688';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "QuestionsForGameEntity" ADD "position" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "QuestionsForGameEntity" DROP COLUMN "position"`,
    );
  }
}
