import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateGameEntities1743324195491 implements MigrationInterface {
    name = 'UpdateGameEntities1743324195491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "GameResult" ("id" uuid NOT NULL, "isDraw" boolean, "gameId" uuid, "winnerPlayerId" uuid, "loserPlayerId" uuid, "loserUserId" uuid, "winnerUserId" uuid, CONSTRAINT "REL_ded711e4265a29fa56f777adca" UNIQUE ("gameId"), CONSTRAINT "REL_270dca75c13a68cfe66941808d" UNIQUE ("winnerPlayerId"), CONSTRAINT "REL_5c6f5cdee7884e27ae0cd15bb0" UNIQUE ("loserPlayerId"), CONSTRAINT "PK_4d6eac18612db846c7fe82aa0bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Game" ADD "gameResultId" uuid`);
        await queryRunner.query(`ALTER TABLE "Game" ADD CONSTRAINT "UQ_3d77b69276c7af1179b3bc4baa9" UNIQUE ("gameResultId")`);
        await queryRunner.query(`ALTER TABLE "Game" ADD CONSTRAINT "FK_3d77b69276c7af1179b3bc4baa9" FOREIGN KEY ("gameResultId") REFERENCES "GameResult"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "GameResult" ADD CONSTRAINT "FK_ded711e4265a29fa56f777adca4" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "GameResult" ADD CONSTRAINT "FK_270dca75c13a68cfe66941808d1" FOREIGN KEY ("winnerPlayerId") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "GameResult" ADD CONSTRAINT "FK_5c6f5cdee7884e27ae0cd15bb03" FOREIGN KEY ("loserPlayerId") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "GameResult" ADD CONSTRAINT "FK_5f4e9888f8e5d0539933b1b11a5" FOREIGN KEY ("loserUserId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "GameResult" ADD CONSTRAINT "FK_a7bd626ecdabf20130535d8918c" FOREIGN KEY ("winnerUserId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "GameResult" DROP CONSTRAINT "FK_a7bd626ecdabf20130535d8918c"`);
        await queryRunner.query(`ALTER TABLE "GameResult" DROP CONSTRAINT "FK_5f4e9888f8e5d0539933b1b11a5"`);
        await queryRunner.query(`ALTER TABLE "GameResult" DROP CONSTRAINT "FK_5c6f5cdee7884e27ae0cd15bb03"`);
        await queryRunner.query(`ALTER TABLE "GameResult" DROP CONSTRAINT "FK_270dca75c13a68cfe66941808d1"`);
        await queryRunner.query(`ALTER TABLE "GameResult" DROP CONSTRAINT "FK_ded711e4265a29fa56f777adca4"`);
        await queryRunner.query(`ALTER TABLE "Game" DROP CONSTRAINT "FK_3d77b69276c7af1179b3bc4baa9"`);
        await queryRunner.query(`ALTER TABLE "Game" DROP CONSTRAINT "UQ_3d77b69276c7af1179b3bc4baa9"`);
        await queryRunner.query(`ALTER TABLE "Game" DROP COLUMN "gameResultId"`);
        await queryRunner.query(`DROP TABLE "GameResult"`);
    }

}
