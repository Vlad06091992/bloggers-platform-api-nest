import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { GameEntity } from 'src/features/quiz/entities/game.entity';
import { PlayerEntity } from 'src/features/quiz/entities/player.entity';
import { QuestionsForGameEntity } from 'src/features/quiz/entities/questions-for-game.entity';
import { AnswersForGameEntity } from 'src/features/quiz/entities/answers-for-game.entity';

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
      game!.startGameDate = new Date();
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
        ])
        .where("g.status = 'Active'")
        .andWhere('g."player1Id" = :playerId OR g."player2Id" = :playerId', {
          playerId,
        })
        .getRawOne();
      return res;
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
      .select(['qq.id as id', 'qq.body as body'])
      .getRawMany();
    return res.sort((a, b) => a.position - b.position);
  }

  // async updatePlayerStatus(player: PlayerEntity, status: string) {
  //   if (!player) {
  //     debugger;
  //     return false;
  //   }
  //   player.status = status;
  //   await this.playerRepo.save(player);
  //   return true;
  // }

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

      // Выполняем операции с таблицей здесь
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

      // Завершаем транзакцию и снятие блокировки
      await queryRunner.commitTransaction();

      return game;
    } catch (err) {
      // Если произошла ошибка, откатываем транзакцию
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // Закрываем временное соединение
      await queryRunner.release();
    }
    // const game = await this.gameRepo
    //   .createQueryBuilder('g')
    //   .orderBy('g."createdAt"', 'DESC')
    //   .select([
    //     'g.player1Id as player1Id',
    //     'g.player2Id as player2Id',
    //     'g.status as status',
    //     'g.createdAt as "createdAt"',
    //   ])
    //   .getRawOne();
    //
    // return game;
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

    // Начинаем транзакцию

    try {
      // Блокируем таблицу на уровне ACCESS EXCLUSIVE
      await queryRunner.query(
        'LOCK TABLE "AnswersForGameEntity" IN ACCESS EXCLUSIVE MODE',
      );
      // Выполняем запрос
      const count = await queryRunner.manager
        .createQueryBuilder('AnswersForGameEntity', 'aq')
        .where('aq."playerId" = :playerId', { playerId })
        .andWhere('aq."gameId" = :gameId', { gameId })
        .getCount();

      // Фиксируем транзакцию
      await queryRunner.commitTransaction();

      return count;
    } catch (err) {
      // В случае ошибки откатываем транзакцию
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // Освобождаем ресурсы
      await queryRunner.release();
    }
  }

  async getPlayerAnsweredQuestion(
    playerId: string,
    withPlayer = false,
  ): Promise<
    {
      questionId: string;
      answerStatus: string;
      addedAt: string;
      playerId: string;
    }[]
  > {
    const selection = [
      'aq.questionId as "questionId"',
      'aq.playerResponseStatus as "answerStatus"',
      'aq.createdAt as "addedAt"',
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
      // Блокируем всю таблицу для записи
      await queryRunner.query(
        'LOCK TABLE "AnswersForGameEntity" IN ACCESS EXCLUSIVE MODE',
      );

      // Выполняем операцию вставки
      await queryRunner.manager
        .getRepository(AnswersForGameEntity)
        .insert(answer);

      // Фиксируем транзакцию
      await queryRunner.commitTransaction();
    } catch (err) {
      // В случае ошибки откатываем транзакцию
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // Освобождаем ресурсы
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
