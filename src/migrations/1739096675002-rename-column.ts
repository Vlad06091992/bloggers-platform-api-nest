import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameColumn1739096675002 implements MigrationInterface {
    name = 'RenameColumn1739096675002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Player" DROP CONSTRAINT "FK_9be207182e9cd0809fe0d8f7302"`);
        await queryRunner.query(`ALTER TABLE "Player" RENAME COLUMN "userId" TO "userIIId"`);
        await queryRunner.query(`ALTER TABLE "Player" ADD CONSTRAINT "FK_f134a6f92193abe520605ebc509" FOREIGN KEY ("userIIId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Player" DROP CONSTRAINT "FK_f134a6f92193abe520605ebc509"`);
        await queryRunner.query(`ALTER TABLE "Player" RENAME COLUMN "userIIId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "Player" ADD CONSTRAINT "FK_9be207182e9cd0809fe0d8f7302" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
