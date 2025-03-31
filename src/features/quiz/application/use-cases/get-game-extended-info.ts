import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from 'src/features/quiz/infrastructure/quiz-repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class GetGameExtendedInfoCommand {
  constructor(
    public gameId: string,
    public userId: string,
  ) {}
}

@CommandHandler(GetGameExtendedInfoCommand)
export class GetGameExtendedInfoHandler
  implements ICommandHandler<GetGameExtendedInfoCommand>
{
  constructor(protected quizRepository: QuizRepository) {}

  async execute({ gameId, userId }: GetGameExtendedInfoCommand) {
    const player = await this.quizRepository.findLastPlayerByUserId(userId);
    const game = await this.quizRepository.getGameInfoById(gameId);
    if (!game) {
      throw new NotFoundException();
    }

    const gameForUser = await this.quizRepository.findGameByPlayerId(
      player?.id,
    );

    if (!gameForUser) {
      throw new ForbiddenException();
    }

    const questions = await this.quizRepository.getQuestionsByGameId(gameId);

    const player1 = await this.quizRepository.findPlayerById(game.player1id);
    const player2 = await this.quizRepository.findPlayerById(game.player2id);
    const answeredQuestionsPlayer1 = player1?.id
      ? await this.quizRepository.getPlayerAnsweredQuestion(player1.id)
      : [];
    const answeredQuestionsPlayer2 = player2?.id
      ? await this.quizRepository.getPlayerAnsweredQuestion(player2.id)
      : [];

    const response = {
      id: gameId,
      firstPlayerProgress: {
        answers: answeredQuestionsPlayer1,
        player: {
          id: player1?.user.id,
          login: player1?.userLogin,
        },
        score: player1?.score,
      },
      secondPlayerProgress:
        game.status === 'PendingSecondPlayer'
          ? null
          : {
              answers: answeredQuestionsPlayer2,
              player: {
                id: player2?.user.id,
                login: player2?.userLogin,
              },
              score: player2?.score,
            },
      questions: game.status === 'PendingSecondPlayer' ? null : questions,
      status: game.status,
      pairCreatedDate: game.createdAt,
      startGameDate:
        game.status === 'PendingSecondPlayer' ? null : game.createdAt,
      finishGameDate: game.status === 'Finished' ? game.finishGameDate : null,
    };

    return response;
  }
}
