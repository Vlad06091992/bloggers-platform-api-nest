import { MigrationInterface, QueryRunner } from "typeorm";

export class DropStatusForPlayer1741584503903 implements MigrationInterface {
    name = 'DropStatusForPlayer1741584503903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Player" DROP COLUMN "status"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Player" ADD "status" character varying NOT NULL DEFAULT 'pending'`);
    }

}
