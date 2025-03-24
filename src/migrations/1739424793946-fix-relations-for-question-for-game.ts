import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRelationsForQuestionForGame1739424793946 implements MigrationInterface {
    name = 'FixRelationsForQuestionForGame1739424793946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuestionsForGameEntity" DROP CONSTRAINT "FK_af1482cbfeb0908d6bbd7694be6"`);
        await queryRunner.query(`ALTER TABLE "QuestionsForGameEntity" DROP CONSTRAINT "FK_495656a139f6b728b878185af61"`);
        await queryRunner.query(`ALTER TABLE "QuestionsForGameEntity" ADD CONSTRAINT "FK_af1482cbfeb0908d6bbd7694be6" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "QuestionsForGameEntity" ADD CONSTRAINT "FK_495656a139f6b728b878185af61" FOREIGN KEY ("questionId") REFERENCES "QuizQuestions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuestionsForGameEntity" DROP CONSTRAINT "FK_495656a139f6b728b878185af61"`);
        await queryRunner.query(`ALTER TABLE "QuestionsForGameEntity" DROP CONSTRAINT "FK_af1482cbfeb0908d6bbd7694be6"`);
        await queryRunner.query(`ALTER TABLE "QuestionsForGameEntity" ADD CONSTRAINT "FK_495656a139f6b728b878185af61" FOREIGN KEY ("questionId") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "QuestionsForGameEntity" ADD CONSTRAINT "FK_af1482cbfeb0908d6bbd7694be6" FOREIGN KEY ("gameId") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
