import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusForGame1739511522302 implements MigrationInterface {
    name = 'AddStatusForGame1739511522302'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Game" ADD "status" character varying NOT NULL DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Game" DROP COLUMN "status"`);
    }

}
