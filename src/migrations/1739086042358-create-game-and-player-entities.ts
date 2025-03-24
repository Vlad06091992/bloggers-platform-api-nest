import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGameAndPlayerEntities1739086042358 implements MigrationInterface {
    name = 'CreateGameAndPlayerEntities1739086042358'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Player" ("id" uuid NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "score" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_c390d9968607986a5f038e3305e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Game" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cce0ee17147c1830d09c19d4d56" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Player" ADD CONSTRAINT "FK_9be207182e9cd0809fe0d8f7302" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Player" DROP CONSTRAINT "FK_9be207182e9cd0809fe0d8f7302"`);
        await queryRunner.query(`DROP TABLE "Game"`);
        await queryRunner.query(`DROP TABLE "Player"`);
    }

}
