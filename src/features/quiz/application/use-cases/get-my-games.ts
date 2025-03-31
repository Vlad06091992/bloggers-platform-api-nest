import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from 'src/features/quiz/infrastructure/quiz-repository';
import { RequiredParamsValuesForMyGames } from 'src/shared/common-types';

export class GetMyGamesExtendedInfoCommand {
  constructor(
    public userId: string,
    public userLogin: string,
    public params: RequiredParamsValuesForMyGames,
  ) {}
}

@CommandHandler(GetMyGamesExtendedInfoCommand)
export class GetMyGamesExtendedInfoHandler
  implements ICommandHandler<GetMyGamesExtendedInfoCommand>
{
  constructor(protected quizRepository: QuizRepository) {}

  async execute({ userId, params }: GetMyGamesExtendedInfoCommand) {
    const { pageNumber, pageSize, sortBy, sortDirection } = params;

    const [games, count] = await this.quizRepository.findGamesByUserId(
      userId,
      params,
    );

    const items = games.map((g) => {
      return {
        id: g.id,
        firstPlayerProgress: {
          answers: g.player1.answers
            .map((a) => {
              return {
                questionId: a.question.id,
                answerStatus: a.playerResponseStatus,
                addedAt: a.createdAt as string,
              };
            })
            .sort(
              (a, b) =>
                new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime(),
            ),
          player: {
            id: g.player1.user.id,
            login: g.player1.user.login,
          },
          score: g.player1.score,
        },
        secondPlayerProgress:
          g.status === 'PendingSecondPlayer'
            ? null
            : {
                answers:
                  g.player2?.answers
                    ?.map((a) => {
                      return {
                        questionId: a.question.id,
                        answerStatus: a.playerResponseStatus,
                        addedAt: a.createdAt,
                      };
                    })
                    .sort(
                      (a, b) =>
                        new Date(a.addedAt).getTime() -
                        new Date(b.addedAt).getTime(),
                    ) || [],
                player: {
                  id: g.player2.user.id,
                  login: g.player2.user.login,
                },
                score: g.player2.score,
              },
        questions:
          g.status === 'PendingSecondPlayer'
            ? null
            : g.questions
                .sort((a, b) => a.position - b.position)
                .map((q) => ({
                  id: q.question.id,
                  body: q.question.body,
                })),
        status: g.status,
        pairCreatedDate: g.createdAt,
        startGameDate: g.createdAt,
        finishGameDate: g.finishGameDate,
      };
    });

    return {
      pagesCount: Math.ceil(count / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: count,
      items,
    };
  }
}
