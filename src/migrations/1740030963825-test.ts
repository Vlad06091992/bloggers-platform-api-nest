import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1740030963825 implements MigrationInterface {
  name = 'Test1740030963825';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Game" DROP CONSTRAINT "FK_2d07ba24d7d9b2ff5a5506fbb51"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Game" ADD CONSTRAINT "FK_2d07ba24d7d9b2ff5a5506fbb51" FOREIGN KEY ("player1Id") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
