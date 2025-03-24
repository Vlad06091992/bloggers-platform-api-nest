import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlayersForGame1739086547413 implements MigrationInterface {
  name = 'AddPlayersForGame1739086547413';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Game" ADD "player1Id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "Game" ADD CONSTRAINT "UQ_2d07ba24d7d9b2ff5a5506fbb51" UNIQUE ("player1Id")`,
    );
    await queryRunner.query(`ALTER TABLE "Game" ADD "player2Id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "Game" ADD CONSTRAINT "UQ_1d90880faffbb57e95c44f452cd" UNIQUE ("player2Id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "Game" ADD CONSTRAINT "FK_2d07ba24d7d9b2ff5a5506fbb51" FOREIGN KEY ("player1Id") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Game" ADD CONSTRAINT "FK_1d90880faffbb57e95c44f452cd" FOREIGN KEY ("player2Id") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Game" DROP CONSTRAINT "FK_1d90880faffbb57e95c44f452cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Game" DROP CONSTRAINT "FK_2d07ba24d7d9b2ff5a5506fbb51"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Game" DROP CONSTRAINT "UQ_1d90880faffbb57e95c44f452cd"`,
    );
    await queryRunner.query(`ALTER TABLE "Game" DROP COLUMN "player2Id"`);
    await queryRunner.query(
      `ALTER TABLE "Game" DROP CONSTRAINT "UQ_2d07ba24d7d9b2ff5a5506fbb51"`,
    );
    await queryRunner.query(`ALTER TABLE "Game" DROP COLUMN "player1Id"`);
  }
}
