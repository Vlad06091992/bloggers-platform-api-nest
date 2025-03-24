import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddResponseStatusForAnswer1739164683612
  implements MigrationInterface
{
  name = 'AddResponseStatusForAnswer1739164683612';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Player" DROP CONSTRAINT "FK_f134a6f92193abe520605ebc509"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Player" RENAME COLUMN "userIIId" TO "userId"`,
    );
    await queryRunner.query(
      `CREATE TABLE "QuestionsForGameEntity" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "gameId" uuid, "questionId" uuid, CONSTRAINT "REL_af1482cbfeb0908d6bbd7694be" UNIQUE ("gameId"), CONSTRAINT "REL_495656a139f6b728b878185af6" UNIQUE ("questionId"), CONSTRAINT "PK_ae2214e806330f8aee437d7366b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "AnswersForGameEntity" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "playerResponseStatus" character varying NOT NULL DEFAULT 'notAnswered', "playerId" uuid, "questionId" uuid, CONSTRAINT "REL_fb51652e336b8c93ee054ff64a" UNIQUE ("playerId"), CONSTRAINT "REL_bb86873b961969c7c2fd69ed6d" UNIQUE ("questionId"), CONSTRAINT "PK_4e6baff95d98bdb3abb411b7f04" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Player" ADD CONSTRAINT "FK_9be207182e9cd0809fe0d8f7302" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
    await queryRunner.query(
      `ALTER TABLE "AnswersForGameEntity" ADD CONSTRAINT "FK_bb86873b961969c7c2fd69ed6d6" FOREIGN KEY ("questionId") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "AnswersForGameEntity" DROP CONSTRAINT "FK_bb86873b961969c7c2fd69ed6d6"`,
    );
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
      `ALTER TABLE "Player" DROP CONSTRAINT "FK_9be207182e9cd0809fe0d8f7302"`,
    );
    await queryRunner.query(`DROP TABLE "AnswersForGameEntity"`);
    await queryRunner.query(`DROP TABLE "QuestionsForGameEntity"`);
    await queryRunner.query(
      `ALTER TABLE "Player" RENAME COLUMN "userId" TO "userIIId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Player" ADD CONSTRAINT "FK_f134a6f92193abe520605ebc509" FOREIGN KEY ("userIIId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
