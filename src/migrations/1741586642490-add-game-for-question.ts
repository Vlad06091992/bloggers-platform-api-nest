import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGameForQuestion1741586642490 implements MigrationInterface {
  name = 'AddGameForQuestion1741586642490';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "AnswersForGameEntity" ADD "gameId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "AnswersForGameEntity" ADD CONSTRAINT "FK_64c81b9bfd8fc2a48961cfbaf69" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "AnswersForGameEntity" DROP CONSTRAINT "FK_64c81b9bfd8fc2a48961cfbaf69"`,
    );
    await queryRunner.query(
      `ALTER TABLE "AnswersForGameEntity" DROP COLUMN "gameId"`,
    );
  }
}
