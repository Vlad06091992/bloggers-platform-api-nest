import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from 'src/features/quiz/infrastructure/quiz-repository';
import { QuizQuestionRepository } from 'src/features/quizQuestions/infrastructure/quiz-question-repository';

export class GetGameExtendedInfoCommand {
  constructor(public gameId: string) {}
}

@CommandHandler(GetGameExtendedInfoCommand)
export class GetGameExtendedInfoHandler
  implements ICommandHandler<GetGameExtendedInfoCommand>
{
  constructor(
    protected quizRepository: QuizRepository,
    protected quizQuestionRepository: QuizQuestionRepository,
  ) {}

  async execute({ gameId }: GetGameExtendedInfoCommand) {
    const game = await this.quizRepository.getGameInfoById(gameId);
    const questions = await this.quizRepository.getQuestionsByGameId(gameId);
    const player1 = await this.quizRepository.findPlayerById(game.player1id);
    const player2 = await this.quizRepository.findPlayerById(game.player2id);

    const answeredQuestionsPlayer1 = player1?.id
      ? await this.quizRepository.getUserAnsweredQuestion(player1.id)
      : [];
    const answeredQuestionsPlayer2 = player2?.id
      ? await this.quizRepository.getUserAnsweredQuestion(player2.id)
      : [];

    const response = {
      id: gameId,
      firstPlayerProgress: {
        answers: answeredQuestionsPlayer1,
        player: {
          id: player1?.id,
          login: player1?.userLogin,
        },
        score: player1?.score,
      },
      secondPlayerProgress:
        game.status === 'pendingSecondPlayer'
          ? null
          : {
              answers: answeredQuestionsPlayer2,
              player: {
                id: player2?.id,
                login: player2?.userLogin,
              },
              score: player2?.score,
            },
      questions: game.status === 'pendingSecondPlayer' ? null : questions,
      status: game.status,
      pairCreatedDate:
        game.status === 'pendingSecondPlayer' ? null : game.createdAt,
      startGameDate:
        game.status === 'pendingSecondPlayer' ? null : game.createdAt,
    };

    return response;
  }
}
