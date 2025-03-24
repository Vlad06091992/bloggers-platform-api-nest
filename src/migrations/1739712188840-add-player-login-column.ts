import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPlayerLoginColumn1739712188840 implements MigrationInterface {
    name = 'AddPlayerLoginColumn1739712188840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Player" ADD "userLogin" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Player" DROP COLUMN "userLogin"`);
    }

}
