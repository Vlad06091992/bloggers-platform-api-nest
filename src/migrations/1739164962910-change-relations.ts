import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeRelations1739164962910 implements MigrationInterface {
  name = 'ChangeRelations1739164962910';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "QuestionsForGameEntity" DROP CONSTRAINT "FK_af1482cbfeb0908d6bbd7694be6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuestionsForGameEntity" DROP CONSTRAINT "FK_495656a139f6b728b878185af61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuestionsForGameEntity" DROP CONSTRAINT "REL_af1482cbfeb0908d6bbd7694be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuestionsForGameEntity" DROP CONSTRAINT "REL_495656a139f6b728b878185af6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "AnswersForGameEntity" DROP CONSTRAINT "FK_fb51652e336b8c93ee054ff64a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "AnswersForGameEntity" DROP CONSTRAINT "REL_fb51652e336b8c93ee054ff64a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuestionsForGameEntity" ADD CONSTRAINT "FK_af1482cbfeb0908d6bbd7694be6" FOREIGN KEY ("gameId") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuestionsForGameEntity" ADD CONSTRAINT "FK_495656a139f6b728b878185af61" FOREIGN KEY ("questionId") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "AnswersForGameEntity" ADD CONSTRAINT "FK_fb51652e336b8c93ee054ff64a7" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "AnswersForGameEntity" DROP CONSTRAINT "FK_fb51652e336b8c93ee054ff64a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuestionsForGameEntity" DROP CONSTRAINT "FK_495656a139f6b728b878185af61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuestionsForGameEntity" DROP CONSTRAINT "FK_af1482cbfeb0908d6bbd7694be6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "AnswersForGameEntity" ADD CONSTRAINT "REL_fb51652e336b8c93ee054ff64a" UNIQUE ("playerId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "AnswersForGameEntity" ADD CONSTRAINT "FK_fb51652e336b8c93ee054ff64a7" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuestionsForGameEntity" ADD CONSTRAINT "REL_495656a139f6b728b878185af6" UNIQUE ("questionId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuestionsForGameEntity" ADD CONSTRAINT "REL_af1482cbfeb0908d6bbd7694be" UNIQUE ("gameId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuestionsForGameEntity" ADD CONSTRAINT "FK_495656a139f6b728b878185af61" FOREIGN KEY ("questionId") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuestionsForGameEntity" ADD CONSTRAINT "FK_af1482cbfeb0908d6bbd7694be6" FOREIGN KEY ("gameId") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
