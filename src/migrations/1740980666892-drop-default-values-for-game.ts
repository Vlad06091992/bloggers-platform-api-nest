import { MigrationInterface, QueryRunner } from "typeorm";

export class DropDefaultValuesForGame1740980666892 implements MigrationInterface {
    name = 'DropDefaultValuesForGame1740980666892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Game" ALTER COLUMN "startGameDate" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Game" ALTER COLUMN "finishGameDate" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Game" ALTER COLUMN "finishGameDate" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Game" ALTER COLUMN "startGameDate" SET DEFAULT now()`);
    }

}
