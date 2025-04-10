import { MigrationInterface, QueryRunner } from "typeorm";

export class DatePlayerCompletedAllQuestions1744090242968 implements MigrationInterface {
    name = 'DatePlayerCompletedAllQuestions1744090242968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Game" ADD "datePlayerCompletedAllQuestions" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Game" DROP COLUMN "datePlayerCompletedAllQuestions"`);
    }

}
