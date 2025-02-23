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
    player.score++;
    await this.playerRepo.save(player);
  }

  async addSecondPlayerForGame(gameA: any, player: PlayerEntity): Promise<any> {
    debugger;
    const game = await this.gameRepo.findOne({ where: { id: gameA!.id } });
    game!.player2 = { id: player.id } as PlayerEntity;
    game!.status = 'active';
    await this.gameRepo.save(game!);
    debugger;
    return { ...game, player1: { id: gameA.player1id } };
  }

  async findPlayerByUserId(userId: string) {
    return await this.playerRepo.findOne({
      where: { user: { id: userId }, status: 'active' },
    });
  }

  async findPlayerById(playerId: string | null) {
    if (!playerId) return null;
    debugger;
    const res = await this.playerRepo.findOne({
      where: { id: playerId },
    });
    debugger;
    return res;
  }

  async findActiveGameByPlayerId(playerId: string | undefined) {
    if (!playerId) {
      debugger;
      return null;
    } else {
      debugger;
      // const res = await this.gameRepo.findOne({
      //   where: [
      //     { status: 'active', player1: { id: playerId! } },
      //     { status: 'active', player2: { id: playerId! } },
      //   ],
      // });

      const res = await this.gameRepo
        .createQueryBuilder('g')
        .select([
          'g.id as id',
          'g.createdAt as createdAt',
          'g.player1Id as player1Id',
          'g.player2Id as player2Id',
          'g.status as status',
        ])
        .where("g.status = 'active'")
        .andWhere('g."player1Id" = :playerId OR g."player2Id" = :playerId', {
          playerId,
        })
        .getRawOne();
      debugger;
      return res;
    }
  }

  // async updatePlayerStatus(status: string, playerId: string) {
  //   const player = await this.playerRepo.findOne({ where: { id: playerId } });
  //   if (!player) return false;
  //   player.status = status;
  //   await this.playerRepo.save(player);
  //   return true;
  // }

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

  async updatePlayerStatus(player: PlayerEntity, status: string) {
    if (!player) return false;
    debugger;
    player.status = status;
    await this.playerRepo.save(player);
    return true;
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
    const game = await this.gameRepo
      .createQueryBuilder('g')
      .orderBy('g."createdAt"', 'DESC')
      .select([
        'g.player1Id as player1Id',
        'g.player2Id as player2Id',
        'g.status as status',
        'g.createdAt as "createdAt"',
      ])
      .getRawOne();

    return game;
  }

  async getUserAnsweredQuestionCount(playerId: string) {
    return await this.answersForGameEntityRepository
      .createQueryBuilder('aq')
      .where('aq."playerId" =:playerId', { playerId })
      .getCount();
  }

  async getUserAnsweredQuestion(
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
    return await this.answersForGameEntityRepository.insert(answer);
  }

  async isAlreadyPendingPlayer(userId: string) {
    const res = await this.playerRepo
      .createQueryBuilder('p')
      .where(
        // `p."status" = 'pending' AND p."gameId" IS NULL AND p.userId =:userId`,
        `p."status" = 'pendingSecondPlayer' AND p.userId =:userId`,
        { userId },
      )
      .getOne();
    return res;
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
