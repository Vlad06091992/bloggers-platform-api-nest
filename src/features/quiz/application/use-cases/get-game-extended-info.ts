import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from 'src/features/quiz/infrastructure/quiz-repository';
import { QuizQuestionRepository } from 'src/features/quizQuestions/infrastructure/quiz-question-repository';
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
  constructor(
    protected quizRepository: QuizRepository,
    protected quizQuestionRepository: QuizQuestionRepository,
  ) {}

  async execute({ gameId, userId }: GetGameExtendedInfoCommand) {
    const player = await this.quizRepository.findPlayerByUserId(userId);

    const game = await this.quizRepository.getGameInfoById(gameId);
    // console.log(game);
    // debugger;

    if (!game) {
      throw new NotFoundException();
    }

    // const players = await this.quizRepository.findPlayerByGameId(game.id);
    // if (players && players?.length >= 2) {
    //   debugger;
    // }

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

    // const response = {
    //   id: gameId,
    //   firstPlayerProgress: {
    //     answers: player?.id === player1?.id ? answeredQuestionsPlayer1 : [],
    //     player: {
    //       id: player1?.user.id,
    //       login: player1?.userLogin,
    //     },
    //     score: player?.id === player1?.id ? player1?.score : 0,
    //   },
    //   secondPlayerProgress:
    //     game.status === 'PendingSecondPlayer'
    //       ? null
    //       : {
    //           answers:
    //             player?.id === player2?.id ? answeredQuestionsPlayer2 : [],
    //           player: {
    //             id: player2?.user.id,
    //             login: player2?.userLogin,
    //           },
    //           score: player?.id === player2?.id ? player2?.score : 0,
    //         },
    //   questions: game.status === 'PendingSecondPlayer' ? null : questions,
    //   status: game.status,
    //   pairCreatedDate: game.createdAt,
    //   startGameDate:
    //     game.status === 'PendingSecondPlayer' ? null : game.createdAt,
    //   finishGameDate: game.status === 'Finished' ? game.finishGameDate : null,
    // };

    return response;
  }
}
