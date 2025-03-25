import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from 'src/features/quiz/infrastructure/quiz-repository';
import { PlayerEntity } from 'src/features/quiz/entities/player.entity';
import { generateUuidV4 } from 'src/utils';
import { UsersEntity } from 'src/features/users/entities/users.entity';
import { ForbiddenException } from '@nestjs/common';
import { GameEntity } from 'src/features/quiz/entities/game.entity';
import { QuizQuestionRepository } from 'src/features/quizQuestions/infrastructure/quiz-question-repository';
import { QuestionsForGameEntity } from 'src/features/quiz/entities/questions-for-game.entity';
import { QuizQuestionsEntity } from 'src/features/quizQuestions/entity/quiz-questions.entity';
import { GetGameExtendedInfoCommand } from 'src/features/quiz/application/use-cases/get-game-extended-info';

export class ConnectionCommand {
  constructor(
    public userId: string,
    public userLogin: string,
  ) {}
}

@CommandHandler(ConnectionCommand)
export class ConnectionHandler implements ICommandHandler<ConnectionCommand> {
  constructor(
    protected quizRepository: QuizRepository,
    protected quizQuestionRepository: QuizQuestionRepository,
    protected commandBus: CommandBus,
  ) {}

  async execute({ userId, userLogin }: ConnectionCommand) {
    const player = await this.quizRepository.findLastPlayerByUserId(userId);

    const gameForUser = await this.quizRepository.findGameByPlayerId(
      player?.id,
      true,
    );

    if (
      gameForUser?.status === 'Active' ||
      gameForUser?.status === 'Finished' ||
      (gameForUser?.player1 && gameForUser.player1.id === player?.id)
    ) {
      throw new ForbiddenException();
    }

    const newPlayer = new PlayerEntity(
      generateUuidV4(),
      null,
      new Date(),
      { id: userId } as UsersEntity,
      userLogin,
    );

    await this.quizRepository.createPlayer(newPlayer);

    const lastCreatedGame = await this.quizRepository.getLastCreatedGame();
    if (
      !lastCreatedGame ||
      lastCreatedGame.status === 'Active' ||
      lastCreatedGame.status === 'Finished'
    ) {
      const game = new GameEntity(
        generateUuidV4(),
        { id: newPlayer.id } as PlayerEntity,
        null,
        new Date(),
        'PendingSecondPlayer',
      );
      const players = await this.quizRepository.findPlayerByGameId(game.id);
      if (players && players?.length >= 2) {
      }

      await this.quizRepository.createGame(game);
      await this.quizRepository.setGameForPlayer(newPlayer, game);
      const questions = await this.quizQuestionRepository.getRandomQuestions(5);
      const questionsWithPosition: QuestionsForGameEntity[] = questions.map(
        (el, i) => ({
          question: { id: el.id } as QuizQuestionsEntity,
          game: { id: game.id } as GameEntity,
          position: i,
          createdAt: new Date(),
          id: generateUuidV4(),
        }),
      );

      await this.quizRepository.setQuestionsForGame(questionsWithPosition);
      return await this.commandBus.execute(
        new GetGameExtendedInfoCommand(game.id, userId),
      );
    } else if (
      lastCreatedGame &&
      lastCreatedGame.status === 'PendingSecondPlayer'
    ) {
      const game = await this.quizRepository.addSecondPlayerForGame(
        lastCreatedGame!,
        newPlayer,
      );

      await this.quizRepository.setGameForPlayer(newPlayer, game!);

      return await this.commandBus.execute(
        new GetGameExtendedInfoCommand(game.id, userId),
      );
    }
  }
}
