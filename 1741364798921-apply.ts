import { MigrationInterface, QueryRunner } from "typeorm";

export class Apply1741364798921 implements MigrationInterface {
    name = 'Apply1741364798921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuizQuestions" ALTER COLUMN "updatedAt" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuizQuestions" ALTER COLUMN "updatedAt" SET NOT NULL`);
    }

}
