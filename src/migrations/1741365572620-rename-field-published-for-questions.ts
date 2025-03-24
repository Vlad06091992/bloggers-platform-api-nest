import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameFieldPublishedForQuestions1741365572620 implements MigrationInterface {
    name = 'RenameFieldPublishedForQuestions1741365572620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuizQuestions" RENAME COLUMN "isPublished" TO "published"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuizQuestions" RENAME COLUMN "published" TO "isPublished"`);
    }

}
