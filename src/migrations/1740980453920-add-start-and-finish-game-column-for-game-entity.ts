import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStartAndFinishGameColumnForGameEntity1740980453920
  implements MigrationInterface
{
  name = 'AddStartAndFinishGameColumnForGameEntity1740980453920';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Game" ADD "startGameDate" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Game" ADD "finishGameDate" TIMESTAMP DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Game" DROP COLUMN "finishGameDate"`);
    await queryRunner.query(`ALTER TABLE "Game" DROP COLUMN "startGameDate"`);
  }
}
