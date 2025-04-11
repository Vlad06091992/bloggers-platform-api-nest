import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { GameEntity } from 'src/features/quiz/entities/game.entity';
import { PlayerEntity } from 'src/features/quiz/entities/player.entity';
import { QuestionsForGameEntity } from 'src/features/quiz/entities/questions-for-game.entity';
import { AnswersForGameEntity } from 'src/features/quiz/entities/answers-for-game.entity';
import { GameResultEntity } from 'src/features/quiz/entities/game_result.entity';
import { UsersEntity } from '../../users/entities/users.entity';
import { RequiredParamsValuesForTopUsers } from '../../../shared/common-types';

@Injectable()
export class QuizRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(GameEntity)
    protected gameRepo: Repository<GameEntity>,
    @InjectRepository(PlayerEntity)
    protected playerRepo: Repository<PlayerEntity>,
    @InjectRepository(QuestionsForGameEntity)
    protected questionsForGameEntityRepository: Repository<QuestionsForGameEntity>,
    @InjectRepository(AnswersForGameEntity)
    protected answersForGameEntityRepository: Repository<AnswersForGameEntity>,
    @InjectRepository(GameResultEntity)
    protected gameResultRepository: Repository<GameResultEntity>,
    @InjectRepository(UsersEntity)
    protected usersRepository: Repository<UsersEntity>,
  ) {}

  async createPlayer(player: PlayerEntity) {
    await this.playerRepo.insert(player);
  }

  async updatePlayerScore(player: PlayerEntity) {
    const newScore = ++player.score;
    await this.playerRepo.save(player);
    return newScore;
  }

  async addSecondPlayerForGame(gameA: any, player: PlayerEntity): Promise<any> {
    const game = await this.gameRepo.findOne({ where: { id: gameA!.id } });

    if (!game?.player2) {
      game!.player2 = { id: player.id } as PlayerEntity;
      game!.status = 'Active';
      await this.gameRepo.save(game!);
    }

    return { ...game, player1: { id: gameA.player1id } };
  }

  async finishedGame(gameA: any): Promise<any> {
    const game = await this.gameRepo.findOne({ where: { id: gameA!.id } });
    game!.status = 'Finished';
    game!.finishGameDate = new Date();
    await this.gameRepo.save(game!);
  }

  // async setDatePlayerCompletedAllQuestions(gameA: any): Promise<any> {
  //   const game = await this.gameRepo.findOne({ where: { id: gameA!.id } });
  //   game!.datePlayerCompletedAllQuestions = new Date();
  //   await this.gameRepo.save(game!);
  // }

  async addGameStatistic(gameResult: GameResultEntity): Promise<any> {
    // ;
    // try {
    return await this.gameResultRepository.insert(gameResult);
    // } catch (e) {
    //   console.log(e);
    //   ;
    // }
  }
  //
  // async addGameStatistic(gameResult: GameResultEntity): Promise<any> {
  //   const result = await this.gameResultRepository.insert(gameResult);
  // }

  async getWinsCount(userId: string): Promise<any> {
    return await this.gameResultRepository
      .createQueryBuilder('r')
      .where('r.winnerUserId =:userId', { userId })
      .getCount();
  }

  async getLoseCount(userId: string): Promise<any> {
    return await this.gameResultRepository
      .createQueryBuilder('r')
      .where('r.loserUserId =:userId', { userId })
      .getCount();
  }

  // async getDrawCount(userId: string): Promise<any> {
  //   const result = await this.gameRepo('g')
  //     .createQueryBuilder('r')
  //     .where('r.winnerUserId =:userId', { userId })
  //     .getCount();
  // }

  async getDrawCount(userId: string | undefined) {
    if (!userId) {
      return null;
    } else {
      const res = await this.gameRepo.query(
        `
                    SELECT COUNT(DISTINCT ("g"."id")) AS "cnt"
                    FROM "Game" "g"
                             LEFT JOIN "Player" "player1" ON "player1"."id" = "g"."player1Id"
                             LEFT JOIN "Player" "player2" ON "player2"."id" = "g"."player2Id"
                             LEFT JOIN "GameResult" "r" ON "r"."gameId" = "g"."id"
                    WHERE r."isDraw" = TRUE
                      AND (
                                PLAYER1."userId" = $1
                            OR PLAYER2."userId" = $1
                        )
                `,
        [userId],
      );

      return +res[0].cnt;
    }
  }

  async findActivePlayerByUserId(userId: string | undefined) {
    if (!userId) return null;
    return await this.playerRepo.findOne({
      where: { user: { id: userId } },
    });
  }

  async findPlayerByGameId(gameId: string | undefined) {
    if (!gameId) return null;
    return await this.playerRepo.find({
      where: { game: { id: gameId } },
    });
  }

  async findPlayerByUserId(userId: string | undefined) {
    if (!userId) return null;
    return await this.playerRepo.findOne({
      where: { user: { id: userId } },
    });
  }

  async findLastPlayerByUserId(userId: string | undefined) {
    if (!userId) return null;
    return await this.playerRepo
      .createQueryBuilder('p')
      .where('p.userId =:userId', { userId })
      .leftJoinAndSelect('p.user', 'user')
      .orderBy('p."createdAt"', 'DESC')
      .getOne();
  }

  async findGamesByUserId(userId: string | undefined, params) {
    if (!userId) return null;
    let { pageNumber, pageSize, sortBy, sortDirection } = params;

    if (sortBy === 'pairCreatedDate') sortBy = 'createdAt';
    const skip = (+pageNumber - 1) * +pageSize;
    return (await this.gameRepo
      .createQueryBuilder('g')
      .leftJoinAndSelect('g.player1', 'player1')
      .leftJoinAndSelect('g.questions', 'questions')
      .leftJoinAndSelect('questions.question', 'qq1')
      .leftJoinAndSelect('g.player2', 'player2')
      .leftJoinAndSelect('player1.user', 'user1')
      .leftJoinAndSelect('player2.user', 'user2')
      .leftJoinAndSelect('player2.answers', 'answers2')
      .leftJoinAndSelect('player1.answers', 'answers1')
      .leftJoinAndSelect('answers1.question', 'question1')
      .leftJoinAndSelect('answers2.question', 'question2')
      .where('user1.id =:userId', { userId })
      .orWhere('user2.id =:userId', { userId })
      .orderBy(`g.${sortBy}`, sortDirection)
      .addOrderBy('g.createdAt', 'DESC') //
      .skip(+skip)
      .take(+pageSize)
      .getManyAndCount()) as any;
  }

  async findGameByPlayerId(
    playerId: string | undefined | null,
    onlyFinishedGame = false,
  ) {
    if (!playerId) return null;
    const res = await this.gameRepo.findOne({
      where: [{ player1: { id: playerId! } }, { player2: { id: playerId! } }],
      relations: ['player1', 'player2'],
    });

    if (res?.status === 'Finished' && onlyFinishedGame) return null;
    return res;
  }

  async findPlayerById(playerId: string | null) {
    if (!playerId) return null;
    const res = await this.playerRepo.findOne({
      where: { id: playerId },
      relations: ['user'],
    });
    return res;
  }

  async findActiveGameByPlayerId(playerId: string | undefined) {
    if (!playerId) {
      return null;
    } else {
      const res = await this.gameRepo
        .createQueryBuilder('g')
        .select([
          'g.id as id',
          'g.createdAt as createdAt',
          'g.player1Id as player1Id',
          'g.player2Id as player2Id',
          'g.status as status',
          // 'g.datePlayerCompletedAllQuestions as "datePlayerCompletedAllQuestions"',
        ])
        .where("g.status = 'Active'")
        .andWhere('g."player1Id" = :playerId OR g."player2Id" = :playerId', {
          playerId,
        })
        .getRawOne();
      return res;
    }
  }

  async findGamesCountByuserId(userId: string | undefined) {
    if (!userId) {
      return null;
    } else {
      const res = await this.gameRepo
        .createQueryBuilder('g')
        .leftJoinAndSelect('g.player1', 'player1')
        .leftJoinAndSelect('g.player2', 'player2')
        .where('player1."userId" = :userId OR player2."userId" = :userId', {
          userId,
        })
        .getCount();
      return res;
    }
  }

  async getTopUsers(params: RequiredParamsValuesForTopUsers) {
    const count = await this.usersRepository.count();
    const { pageNumber, pageSize } = params;

    const skip = (+pageNumber - 1) * +pageSize;

    const result = await this.usersRepository
      .createQueryBuilder('u')
      .select(['u.id as "userId"', 'u.login as login'])
      .addSelect(
        `COALESCE(
    (
      SELECT
        COUNT("winnerUserId") AS "winsCount"
      FROM
        PUBLIC."GameResult" GR
      WHERE
        GR."winnerUserId" = "u"."id"
      GROUP BY
        "winnerUserId"
    ),
    0
  ) AS "winsCount"`,
      )
      .addSelect(
        `    COALESCE(
          (
            SELECT
              COUNT("loserUserId") AS "loseCount"
            FROM
              PUBLIC."GameResult" GR
            WHERE
              GR."loserUserId" = U.ID
            GROUP BY
              "loserUserId"
          ),
          0
         ) AS "lossesCount"`,
      )

      .addSelect(
        `COALESCE(
          (
            SELECT
              COUNT(
                CASE
                  WHEN "isDraw" = TRUE THEN 1
                END
              ) AS "drawsCount"
            FROM
              (
                SELECT
                  P.ID,
                  "userId",
                  P."gameId",
                  GR."isDraw"
                FROM
                  PUBLIC."Player" P
                  LEFT JOIN "GameResult" GR ON GR."gameId" = P."gameId"
                WHERE
                  P."userId" = U.ID
              ) AS R
            GROUP BY
              "userId"
          ),
          0
        ) AS "drawsCount"`,
      )
      .addSelect(
        `        COALESCE(
          (
            SELECT
              COUNT("gameId") AS "gamesCount"
            FROM
              (
                SELECT
                  P."gameId", uu.id as "userId"
                FROM
                  PUBLIC."Users" uu
                  LEFT JOIN "Player" P ON uu."id" = P."userId"
                WHERE
                  U."id" = P."userId"
              ) AS V
            GROUP BY
              "userId"
          ),
          0
        ) AS "gamesCount"`,
      )
      .addSelect(
        `  COALESCE(
    (
      SELECT
        SUM(COALESCE(SCORE, 0))
      FROM
        PUBLIC."Player" P
      WHERE
        P."userId" = U."id"
      GROUP BY
        "userId"
    ),
    0
  ) AS "sumScore"`,
      )
      .addSelect(
        `
                    COALESCE(
  (
    SELECT AVG(SCORE)
    FROM PUBLIC."Player" P
    WHERE P."userId" = U."id"
  ), 0) AS "avgScores"`,
      )
      .skip(+skip)
      .take(+pageSize);

    for (const key in params.validSortParams) {
      const value = Object.keys(params.validSortParams[key])[0];
      const direction = Object.values(params.validSortParams[key])[0] as
        | 'DESC'
        | 'ASC';
      if (+key === 0) {
        result.orderBy(`"${value}"`, `${direction}`);
      } else {
        result.addOrderBy(`"${value}"`, `${direction}`);
      }
    }

    return { items: await result.getRawMany(), totalCount: count };
  }

  //     async getTopUsers() { только подзапросы
  //     const res = await this.dataSource.query(`SELECT
  //   U.ID,
  //   COALESCE(
  //     (
  //       SELECT
  //         SUM(COALESCE(SCORE, 0))
  //       FROM
  //         PUBLIC."Player" P
  //       WHERE
  //         P."userId" = U."id"
  //       GROUP BY
  //         "userId"
  //     ),
  //     0
  //   ) AS COUNT,
  //   COALESCE(
  //     (
  //       SELECT
  //         COUNT("winnerUserId") AS "winsCount"
  //       FROM
  //         PUBLIC."GameResult" GR
  //       WHERE
  //         GR."winnerUserId" = U."id"
  //       GROUP BY
  //         "winnerUserId"
  //     ),
  //     0
  //   ) AS "winsCount",
  //   COALESCE(
  //     (
  //       SELECT
  //         COUNT("loserUserId") AS "loseCount"
  //       FROM
  //         PUBLIC."GameResult" GR
  //       WHERE
  //         GR."loserUserId" = U.ID
  //       GROUP BY
  //         "loserUserId"
  //     ),
  //     0
  //   ) AS LOSECOUNT,
  //   COALESCE(
  //     (
  //       SELECT
  //         COUNT(
  //           CASE
  //             WHEN "isDraw" = TRUE THEN 1
  //           END
  //         ) AS "drawCount"
  //       FROM
  //         (
  //           SELECT
  //             P.ID,
  //             "userId",
  //             P."gameId",
  //             GR."isDraw"
  //           FROM
  //             PUBLIC."Player" P
  //             LEFT JOIN "GameResult" GR ON GR."gameId" = P."gameId"
  //           WHERE
  //             P."userId" = U.ID
  //         ) AS R
  //       GROUP BY
  //         "userId"
  //     ),
  //     0
  //   ) AS DRAWCOUNT,
  //   COALESCE(
  //     (
  //       SELECT
  //         COUNT("gameId") AS "gamesCount"
  //       FROM
  //         (
  //           SELECT
  //             P."gameId", uu.id as "userId"
  //           FROM
  //             PUBLIC."Users" uu
  //             LEFT JOIN "Player" P ON uu."id" = P."userId"
  //           WHERE
  //             U."id" = P."userId"
  //         ) AS V
  //       GROUP BY
  //         "userId"
  //     ),
  //     0
  //   ) AS GAMESCOUNT
  // FROM
  //   PUBLIC."Users" U
  // ORDER BY
  //   "count" ASC`)
  //       return res;
  //   }

  async findWinsCountBy(userId: string | undefined) {
    if (!userId) {
      return null;
    } else {
      const res = await this.gameRepo
        .createQueryBuilder('g')
        .leftJoinAndSelect('g.player1', 'player1')
        .leftJoinAndSelect('g.player2', 'player2')
        .where('player1."userId" = :userId OR player2."userId" = :userId', {
          userId,
        })
        .getCount();
      return res;
    }
  }

  async findScoreCountByUserId(userId: string | undefined) {
    if (!userId) {
      return null;
    } else {
      const res = await this.playerRepo
        .createQueryBuilder('p')
        .where('p."userId" = :userId', {
          userId,
        })
        .select('SUM(score)', 'sumScore')
        .getRawOne();
      return +res.sumScore;
    }
  }

  async setQuestionsForGame(questions: Array<QuestionsForGameEntity>) {
    await this.questionsForGameEntityRepository.insert(questions);
  }

  async getQuestionByGameIdAndPosition(
    gameId: string,
    position: number,
  ): Promise<{
    position: number;
    id: string;
    body: string;
    correctanswers: string[];
  }> {
    const res = await this.questionsForGameEntityRepository
      .createQueryBuilder('qg')
      .where('qg.gameId =:gameId', { gameId })
      .andWhere('qg.position =:position', { position })
      .leftJoinAndSelect('qg.question', 'qq')
      .select([
        'qg.position as position',
        'qq.body as body',
        'qq.correctAnswers as correctAnswers',
        'qq.id as id',
      ])
      .getRawOne();
    return res;
  }

  async getQuestionsByGameId(gameId: string) {
    const res = await this.questionsForGameEntityRepository
      .createQueryBuilder('qg')
      .where('qg.gameId =:gameId', { gameId })
      .leftJoinAndSelect('qg.question', 'qq')
      .select(['qq.id as id', 'qq.body as body', 'qg.position as position'])
      .getRawMany();

    return res
      .sort((a, b) => a.position - b.position)
      .map((el) => ({ id: el.id, body: el.body }));
  }

  async setGameForPlayer(player: PlayerEntity, game: GameEntity) {
    if (!player) return false;
    player.game = game;
    await this.playerRepo.save(player);
    return true;
  }

  async createGame(game: GameEntity) {
    await this.gameRepo.insert(game);
  }

  async getGameInfoById(gameId) {
    return await this.gameRepo
      .createQueryBuilder('g')
      .where('g.id = :gameId', { gameId })
      .select([
        'g.player1Id as player1Id',
        'g.player2Id as player2Id',
        'g.status as status',
        'g.createdAt as "createdAt"',
        'g.finishGameDate as "finishGameDate"',
      ])
      .getRawOne();
  }

  async getLastConnectedPlayer() {
    return await this.playerRepo
      .createQueryBuilder('p')
      .orderBy('p."createdAt"', 'DESC')
      .getOne();
  }

  async getLastCreatedGame() {
    const queryRunner = this.gameRepo.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.query('LOCK TABLE "Game" IN ACCESS EXCLUSIVE MODE;');

      const game = await queryRunner.manager
        .createQueryBuilder('GameEntity', 'g')
        .orderBy('g."createdAt"', 'DESC')
        .select([
          'g.player1Id as player1Id',
          'g.id as id',
          'g.player2Id as player2Id',
          'g.status as status',
          'g.createdAt as "createdAt"',
        ])
        .getRawOne();

      await queryRunner.commitTransaction();

      return game;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getUserAnsweredQuestionCount(
    playerId: string | undefined,
    gameId: string | undefined,
  ) {
    if (!playerId || !gameId) return null;
    const queryRunner =
      this.answersForGameEntityRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.query(
        'LOCK TABLE "AnswersForGameEntity" IN ACCESS EXCLUSIVE MODE',
      );
      const count = await queryRunner.manager
        .createQueryBuilder('AnswersForGameEntity', 'aq')
        .where('aq."playerId" = :playerId', { playerId })
        .andWhere('aq."gameId" = :gameId', { gameId })
        .getCount();

      await queryRunner.commitTransaction();

      return count;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getPlayerAnsweredQuestion(
    playerId: string,
    withPlayer = false,
  ): Promise<
    {
      questionId: string;
      answer: string;
      answerStatus: string;
      addedAt: string;
      playerId: string;
    }[]
  > {
    const selection = [
      'aq.questionId as "questionId"',
      'aq.playerResponseStatus as "answerStatus"',
      'aq.createdAt as "addedAt"',
      'aq.answer as "answer"',
    ];

    withPlayer && selection.push('aq."playerId" as "playerId"');

    return await this.answersForGameEntityRepository
      .createQueryBuilder('aq')
      .select(selection)
      .where('aq."playerId" =:playerId', { playerId })
      .getRawMany();
  }

  async getAnswersByPlayerId(
    playerId: string,
  ): Promise<{ questionId: string; status: string; addedAt: string }[]> {
    return await this.answersForGameEntityRepository
      .createQueryBuilder('aq')
      .select([
        'aq.questionId as "questionId"',
        'aq.playerResponseStatus as status',
        'aq.createdAt as "addedAt"',
      ])
      .where('aq."playerId" =:playerId', { playerId })
      .getRawMany();
  }

  async writeAnswerForPlayer(answer: AnswersForGameEntity) {
    const queryRunner =
      this.answersForGameEntityRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.query(
        'LOCK TABLE "AnswersForGameEntity" IN ACCESS EXCLUSIVE MODE',
      );
      await queryRunner.manager
        .getRepository(AnswersForGameEntity)
        .insert(answer);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async clearData() {
    await this.dataSource.query(
      `TRUNCATE TABLE public."AnswersForGameEntity" CASCADE;`,
      [],
    );

    await this.dataSource.query(
      `TRUNCATE TABLE public."QuestionsForGameEntity" CASCADE;`,
      [],
    );

    await this.dataSource.query(`TRUNCATE TABLE public."Player" CASCADE;`, []);
    await this.dataSource.query(`TRUNCATE TABLE public."Game" CASCADE;`, []);
  }
}
