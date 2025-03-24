import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGameForPlayer1739086646606 implements MigrationInterface {
    name = 'AddGameForPlayer1739086646606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Player" ADD "gameId" uuid`);
        await queryRunner.query(`ALTER TABLE "Player" ADD CONSTRAINT "UQ_8d382155f20c03f32151b2bb003" UNIQUE ("gameId")`);
        await queryRunner.query(`ALTER TABLE "Player" ADD CONSTRAINT "FK_8d382155f20c03f32151b2bb003" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Player" DROP CONSTRAINT "FK_8d382155f20c03f32151b2bb003"`);
        await queryRunner.query(`ALTER TABLE "Player" DROP CONSTRAINT "UQ_8d382155f20c03f32151b2bb003"`);
        await queryRunner.query(`ALTER TABLE "Player" DROP COLUMN "gameId"`);
    }

}
