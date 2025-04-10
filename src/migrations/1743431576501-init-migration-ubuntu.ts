import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigrationUbuntu1743431576501 implements MigrationInterface {
    name = 'InitMigrationUbuntu1743431576501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "UsersRegistrationData" ("id" character varying NOT NULL, "confirmationCode" character varying NOT NULL, "expirationDate" TIMESTAMP NOT NULL, "isConfirmed" boolean NOT NULL, "userId" uuid, CONSTRAINT "REL_4c475a8a8af622de2de0b267a3" UNIQUE ("userId"), CONSTRAINT "PK_a01f065bfbe51151e5c4834aba8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Users" ("id" uuid NOT NULL, "email" character varying NOT NULL, "login" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "AnswersForGameEntity" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "playerResponseStatus" character varying NOT NULL DEFAULT 'notAnswered', "answer" character varying NOT NULL, "playerId" uuid, "questionId" uuid, "gameId" uuid, CONSTRAINT "PK_4e6baff95d98bdb3abb411b7f04" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Player" ("id" uuid NOT NULL, "userLogin" character varying NOT NULL, "score" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "gameId" uuid, CONSTRAINT "PK_c390d9968607986a5f038e3305e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "GameResult" ("id" uuid NOT NULL, "isDraw" boolean, "gameId" uuid, "winnerPlayerId" uuid, "loserPlayerId" uuid, "loserUserId" uuid, "winnerUserId" uuid, CONSTRAINT "REL_ded711e4265a29fa56f777adca" UNIQUE ("gameId"), CONSTRAINT "REL_270dca75c13a68cfe66941808d" UNIQUE ("winnerPlayerId"), CONSTRAINT "REL_5c6f5cdee7884e27ae0cd15bb0" UNIQUE ("loserPlayerId"), CONSTRAINT "PK_4d6eac18612db846c7fe82aa0bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Game" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "startGameDate" TIMESTAMP NOT NULL DEFAULT now(), "finishGameDate" TIMESTAMP, "status" character varying NOT NULL DEFAULT 'active', "player1Id" uuid, "player2Id" uuid, "gameResultId" uuid, CONSTRAINT "REL_3d77b69276c7af1179b3bc4baa" UNIQUE ("gameResultId"), CONSTRAINT "PK_cce0ee17147c1830d09c19d4d56" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "QuestionsForGameEntity" ("id" uuid NOT NULL, "position" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "gameId" uuid, "questionId" uuid, CONSTRAINT "PK_ae2214e806330f8aee437d7366b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "QuizQuestions" ("id" uuid NOT NULL, "body" character varying NOT NULL, "published" boolean NOT NULL DEFAULT false, "correctAnswers" jsonb NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_da996a025cd02877083c47ea971" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Blogs" ("id" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "websiteUrl" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "isMembership" boolean NOT NULL, CONSTRAINT "PK_007e2aca1eccf50f10c9176a71c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Posts" ("id" uuid NOT NULL, "title" character varying NOT NULL, "shortDescription" character varying NOT NULL, "content" character varying NOT NULL, "blogName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "blogId" character varying, CONSTRAINT "PK_0f050d6d1112b2d07545b43f945" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "PostsReactions" ("id" character varying NOT NULL, "likeStatus" character varying NOT NULL, "addedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "postId" uuid, CONSTRAINT "PK_3f00b464f771b109e3b897bb4c5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Comments" ("id" uuid NOT NULL, "content" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "postId" uuid, "userId" uuid, CONSTRAINT "PK_91e576c94d7d4f888c471fb43de" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "CommentsReactions" ("id" character varying NOT NULL, "likeStatus" character varying NOT NULL, "addedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "commentId" uuid, CONSTRAINT "PK_af64bf2c0fecb41acf717a436a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "RecoveryPasswordCodes" ("id" character varying NOT NULL, "userId" character varying NOT NULL, "email" character varying NOT NULL, "recoveryCode" character varying NOT NULL, "expirationDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_7cf63afc639d03c31b64cb9d40d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "AuthDevices" ("id" character varying NOT NULL, "ip" character varying NOT NULL, "title" character varying NOT NULL, "userId" character varying NOT NULL, "deviceId" character varying NOT NULL, "lastActiveDate" TIMESTAMP NOT NULL, "isActive" boolean NOT NULL, CONSTRAINT "PK_9e43277806194c90175bbe6e508" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "OldTokenIds" ("expiredTokenId" character varying NOT NULL, CONSTRAINT "PK_0c2d54a18e6dc93c5309ce2f478" PRIMARY KEY ("expiredTokenId"))`);
        await queryRunner.query(`ALTER TABLE "UsersRegistrationData" ADD CONSTRAINT "FK_4c475a8a8af622de2de0b267a3f" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "AnswersForGameEntity" ADD CONSTRAINT "FK_fb51652e336b8c93ee054ff64a7" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "AnswersForGameEntity" ADD CONSTRAINT "FK_bb86873b961969c7c2fd69ed6d6" FOREIGN KEY ("questionId") REFERENCES "QuizQuestions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "AnswersForGameEntity" ADD CONSTRAINT "FK_64c81b9bfd8fc2a48961cfbaf69" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Player" ADD CONSTRAINT "FK_9be207182e9cd0809fe0d8f7302" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Player" ADD CONSTRAINT "FK_8d382155f20c03f32151b2bb003" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "GameResult" ADD CONSTRAINT "FK_ded711e4265a29fa56f777adca4" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "GameResult" ADD CONSTRAINT "FK_270dca75c13a68cfe66941808d1" FOREIGN KEY ("winnerPlayerId") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "GameResult" ADD CONSTRAINT "FK_5c6f5cdee7884e27ae0cd15bb03" FOREIGN KEY ("loserPlayerId") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "GameResult" ADD CONSTRAINT "FK_5f4e9888f8e5d0539933b1b11a5" FOREIGN KEY ("loserUserId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "GameResult" ADD CONSTRAINT "FK_a7bd626ecdabf20130535d8918c" FOREIGN KEY ("winnerUserId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Game" ADD CONSTRAINT "FK_3d77b69276c7af1179b3bc4baa9" FOREIGN KEY ("gameResultId") REFERENCES "GameResult"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "QuestionsForGameEntity" ADD CONSTRAINT "FK_af1482cbfeb0908d6bbd7694be6" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "QuestionsForGameEntity" ADD CONSTRAINT "FK_495656a139f6b728b878185af61" FOREIGN KEY ("questionId") REFERENCES "QuizQuestions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Posts" ADD CONSTRAINT "FK_3d48d13b4578bccfbda468b1c4c" FOREIGN KEY ("blogId") REFERENCES "Blogs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PostsReactions" ADD CONSTRAINT "FK_72c5539adcf4e17483039d4c2c3" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PostsReactions" ADD CONSTRAINT "FK_e599859ba72ff41aad3814ceabb" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Comments" ADD CONSTRAINT "FK_68844d71da70caf0f0f4b0ed72d" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Comments" ADD CONSTRAINT "FK_aa80cd9ae4c341f0aeba2401b10" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CommentsReactions" ADD CONSTRAINT "FK_836f703a7f8b8d23c609077bf7a" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CommentsReactions" ADD CONSTRAINT "FK_ed2117af7625222ba0b6bbc219b" FOREIGN KEY ("commentId") REFERENCES "Comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "CommentsReactions" DROP CONSTRAINT "FK_ed2117af7625222ba0b6bbc219b"`);
        await queryRunner.query(`ALTER TABLE "CommentsReactions" DROP CONSTRAINT "FK_836f703a7f8b8d23c609077bf7a"`);
        await queryRunner.query(`ALTER TABLE "Comments" DROP CONSTRAINT "FK_aa80cd9ae4c341f0aeba2401b10"`);
        await queryRunner.query(`ALTER TABLE "Comments" DROP CONSTRAINT "FK_68844d71da70caf0f0f4b0ed72d"`);
        await queryRunner.query(`ALTER TABLE "PostsReactions" DROP CONSTRAINT "FK_e599859ba72ff41aad3814ceabb"`);
        await queryRunner.query(`ALTER TABLE "PostsReactions" DROP CONSTRAINT "FK_72c5539adcf4e17483039d4c2c3"`);
        await queryRunner.query(`ALTER TABLE "Posts" DROP CONSTRAINT "FK_3d48d13b4578bccfbda468b1c4c"`);
        await queryRunner.query(`ALTER TABLE "QuestionsForGameEntity" DROP CONSTRAINT "FK_495656a139f6b728b878185af61"`);
        await queryRunner.query(`ALTER TABLE "QuestionsForGameEntity" DROP CONSTRAINT "FK_af1482cbfeb0908d6bbd7694be6"`);
        await queryRunner.query(`ALTER TABLE "Game" DROP CONSTRAINT "FK_3d77b69276c7af1179b3bc4baa9"`);
        await queryRunner.query(`ALTER TABLE "GameResult" DROP CONSTRAINT "FK_a7bd626ecdabf20130535d8918c"`);
        await queryRunner.query(`ALTER TABLE "GameResult" DROP CONSTRAINT "FK_5f4e9888f8e5d0539933b1b11a5"`);
        await queryRunner.query(`ALTER TABLE "GameResult" DROP CONSTRAINT "FK_5c6f5cdee7884e27ae0cd15bb03"`);
        await queryRunner.query(`ALTER TABLE "GameResult" DROP CONSTRAINT "FK_270dca75c13a68cfe66941808d1"`);
        await queryRunner.query(`ALTER TABLE "GameResult" DROP CONSTRAINT "FK_ded711e4265a29fa56f777adca4"`);
        await queryRunner.query(`ALTER TABLE "Player" DROP CONSTRAINT "FK_8d382155f20c03f32151b2bb003"`);
        await queryRunner.query(`ALTER TABLE "Player" DROP CONSTRAINT "FK_9be207182e9cd0809fe0d8f7302"`);
        await queryRunner.query(`ALTER TABLE "AnswersForGameEntity" DROP CONSTRAINT "FK_64c81b9bfd8fc2a48961cfbaf69"`);
        await queryRunner.query(`ALTER TABLE "AnswersForGameEntity" DROP CONSTRAINT "FK_bb86873b961969c7c2fd69ed6d6"`);
        await queryRunner.query(`ALTER TABLE "AnswersForGameEntity" DROP CONSTRAINT "FK_fb51652e336b8c93ee054ff64a7"`);
        await queryRunner.query(`ALTER TABLE "UsersRegistrationData" DROP CONSTRAINT "FK_4c475a8a8af622de2de0b267a3f"`);
        await queryRunner.query(`DROP TABLE "OldTokenIds"`);
        await queryRunner.query(`DROP TABLE "AuthDevices"`);
        await queryRunner.query(`DROP TABLE "RecoveryPasswordCodes"`);
        await queryRunner.query(`DROP TABLE "CommentsReactions"`);
        await queryRunner.query(`DROP TABLE "Comments"`);
        await queryRunner.query(`DROP TABLE "PostsReactions"`);
        await queryRunner.query(`DROP TABLE "Posts"`);
        await queryRunner.query(`DROP TABLE "Blogs"`);
        await queryRunner.query(`DROP TABLE "QuizQuestions"`);
        await queryRunner.query(`DROP TABLE "QuestionsForGameEntity"`);
        await queryRunner.query(`DROP TABLE "Game"`);
        await queryRunner.query(`DROP TABLE "GameResult"`);
        await queryRunner.query(`DROP TABLE "Player"`);
        await queryRunner.query(`DROP TABLE "AnswersForGameEntity"`);
        await queryRunner.query(`DROP TABLE "Users"`);
        await queryRunner.query(`DROP TABLE "UsersRegistrationData"`);
    }

}
