import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAnswerForAnswersForGameEntity1739709433297 implements MigrationInterface {
    name = 'AddAnswerForAnswersForGameEntity1739709433297'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "AnswersForGameEntity" ADD "answer" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "AnswersForGameEntity" DROP COLUMN "answer"`);
    }

}
