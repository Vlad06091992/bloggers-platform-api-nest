import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from 'src/features/quiz/infrastructure/quiz-repository';
import { PlayerEntity } from 'src/features/quiz/entities/player.entity';
import { generateUuidV4 } from 'src/utils';
import { ForbiddenException } from '@nestjs/common';
import { QuizQuestionRepository } from 'src/features/quizQuestions/infrastructure/quiz-question-repository';
import { QuizQuestionsEntity } from 'src/features/quizQuestions/entity/quiz-questions.entity';
import { AnswersForGameEntity } from 'src/features/quiz/entities/answers-for-game.entity';
import { GameResultEntity } from 'src/features/quiz/entities/game_result.entity';

const getOtherPlayerId = (game, playerId: string) => {
  const { player1id, player2id } = game;
  return playerId === player1id ? player2id : player1id;
};

export class AnswerCommand {
  constructor(
    public userId: string,
    public answer: string,
  ) {}
}

type AnswersAndTime = {
  questionId: string;
  answerStatus: string;
  addedAt: string;
  playerId: string;
}[];

const checkAnswersAndTime = (
  questionOne: AnswersAndTime,
  questionTwo: AnswersAndTime,
  mode = 'default',
): {
  isExistCorrectAnswerFirstPlayer: true;
  allAnswersFaster: true;
  playerId: string | null;
} | null => {
  let isExistCorrectAnswerFirstPlayer = false;
  let allAnswersFaster = mode !== 'default';
  if (mode === 'after') {
  }
  const lastQuestionOne =
    mode === 'default'
      ? questionOne[4]
      : questionOne[questionOne.length - 1] || null;
  const lastQuestionTwo =
    mode === 'default'
      ? questionTwo[4]
      : questionTwo[questionTwo.length - 1] || null;

  try {
    const playerId =
      mode === 'default'
        ? questionOne[0].playerId
        : questionOne.length > questionTwo.length
          ? questionOne[0].playerId
          : null;

    if (
      new Date(lastQuestionOne?.addedAt)?.getTime() <
      new Date(lastQuestionTwo?.addedAt)?.getTime()
    ) {
      allAnswersFaster = true;
    }
    for (let i = 0; i < questionOne.length; i++) {
      const curr1 = questionOne[i];
      if (curr1.answerStatus === 'Correct') {
        isExistCorrectAnswerFirstPlayer = true;
      }
    }

    if (mode === 'after') {
    }

    if (isExistCorrectAnswerFirstPlayer && allAnswersFaster) {
      return {
        isExistCorrectAnswerFirstPlayer,
        allAnswersFaster,
        playerId: playerId,
      };
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
};

@CommandHandler(AnswerCommand)
export class AnswerHandler implements ICommandHandler<AnswerCommand> {
  constructor(
    protected quizRepository: QuizRepository,
    protected quizQuestionRepository: QuizQuestionRepository,
  ) {}

  async execute({ userId, answer }: AnswerCommand) {
    const player = await this.quizRepository.findLastPlayerByUserId(userId);

    const game = await this.quizRepository.findActiveGameByPlayerId(player?.id);

    const otherPlayerId = getOtherPlayerId(game, player!.id);

    const otherPlayer = await this.quizRepository.findPlayerById(otherPlayerId);

    const help = {
      debug: false,
      d() {
        console.log(this.game);
        console.log(this.player);
        console.log(this.userId);
      },
      game,
      player,
      userId,
    };

    if (!game || game.status === 'Finished') {
      throw new ForbiddenException();
    }

    // const datePlayerCompletedAllQuestions =
    //   game.datePlayerCompletedAllQuestions || null;

    // if (datePlayerCompletedAllQuestions) {
    if (false) {
      // const currentDate = new Date();
      // const millisecondsCurrentDate = currentDate.getTime()
      // const millisecondsDatePlayerCompletedAllQuestions = datePlayerCompletedAllQuestions.getTime()
      //
      //
      // if (millisecondsCurrentDate - millisecondsDatePlayerCompletedAllQuestions > 10000) {
      //
      //
      //
      //
      //     const res1 = await this.quizRepository.getPlayerAnsweredQuestion(
      //         player!.id,
      //         true,
      //     );
      //     const res2 = await this.quizRepository.getPlayerAnsweredQuestion(
      //         otherPlayerId,
      //         true,
      //     );
      //
      //
      //     //заполнить неотвеченные вопросы
      //
      //     const playerIdforFill = res1.length > res2.length ? res2[0].playerId : res1[0].playerId
      //
      //     const answersCount = Math.abs(res1.length - res2.length)
      //
      //
      //
      //     for (let i = 0; i < answersCount; i++) {
      //
      //
      //         const answeredQuestionCount =
      //             await this.quizRepository.getUserAnsweredQuestionCount(
      //                 player?.id,
      //                 game.id,
      //             );
      //
      //         if (!player || answeredQuestionCount === 5) {
      //             throw new ForbiddenException();
      //         }
      //
      //         const question = await this.quizRepository.getQuestionByGameIdAndPosition(
      //             game.id,
      //             answeredQuestionCount as number,
      //         );
      //
      //         const playerAnswer = new AnswersForGameEntity(
      //             generateUuidV4(),
      //             {id: playerIdforFill} as PlayerEntity,
      //             {id: question.id} as QuizQuestionsEntity,
      //             'Incorrect',
      //             new Date(),
      //             '',
      //             game,
      //         );
      //         await this.quizRepository.writeAnswerForPlayer(playerAnswer);
      //
      //
      //     }
      //
      //
      //     let res = checkAnswersAndTime(res1, res2);
      //
      //
      //
      //     if (!res) {
      //         res = checkAnswersAndTime(res2, res1);
      //     }
      //
      //
      //
      //     if (res) {
      //         const pl = [otherPlayer, player].find((p) => p!.id === res?.playerId);
      //         await this.quizRepository.updatePlayerScore(pl!);
      //     }
      //
      //
      //
      //     let loser;
      //     let winner;
      //
      //     player!.score > otherPlayer!.score
      //         ? ((winner = player), (loser = otherPlayer))
      //         : otherPlayer!.score > player!.score
      //             ? ((loser = player), (winner = otherPlayer))
      //             : null;
      //
      //     ;
      //
      //     const result = new GameResultEntity(
      //         generateUuidV4(),
      //         game,
      //         winner || null,
      //         winner?.user || null,
      //         loser || null,
      //         loser?.user || null,
      //         !winner,
      //     );
      //
      //     await this.quizRepository.addGameStatistic(result);
      //
      //     await this.quizRepository.finishedGame(game);
      //
      //     throw new ForbiddenException()
      // }
    } else {
      const answeredQuestionCount =
        await this.quizRepository.getUserAnsweredQuestionCount(
          player?.id,
          game.id,
        );

      if (!player || answeredQuestionCount === 5) {
        throw new ForbiddenException();
      }

      const question = await this.quizRepository.getQuestionByGameIdAndPosition(
        game.id,
        answeredQuestionCount as number,
      );
      const isCorrect = question.correctanswers.find((a) => a === answer);

      const addedAt = new Date();

      const playerResponseStatus = isCorrect ? 'Correct' : 'Incorrect';
      const id = generateUuidV4();

      const playerAnswer = new AnswersForGameEntity(
        id,
        { id: player.id } as PlayerEntity,
        { id: question.id } as QuizQuestionsEntity,
        playerResponseStatus,
        addedAt,
        answer,
        game,
      );
      await this.quizRepository.writeAnswerForPlayer(playerAnswer);

      const answeredQuestionCountAfterResponse = answeredQuestionCount! + 1;

      if (isCorrect) {
        await this.quizRepository.updatePlayerScore(player);
      }

      const answeredQuestionCountOtherPlayer =
        await this.quizRepository.getUserAnsweredQuestionCount(
          otherPlayerId,
          game.id,
        );

      if (help.debug) {
      }

      if (
        (answeredQuestionCountOtherPlayer === 5 &&
          answeredQuestionCountAfterResponse !== 5) ||
        (answeredQuestionCountAfterResponse === 5 &&
          answeredQuestionCountOtherPlayer !== 5)
      ) {
        setTimeout(
          async ({ game, userId }) => {
            const player =
              await this.quizRepository.findLastPlayerByUserId(userId);
            const currGame = await this.quizRepository.findActiveGameByPlayerId(
              player?.id,
            );
            if (currGame) {
              // ;
              const player =
                await this.quizRepository.findLastPlayerByUserId(userId);

              const res1 = await this.quizRepository.getPlayerAnsweredQuestion(
                player!.id,
                true,
              );
              const res2 = await this.quizRepository.getPlayerAnsweredQuestion(
                otherPlayerId,
                true,
              );
              // ;
              //заполнить неотвеченные вопросы

              const playerIdforFill =
                res1.length > res2.length ? otherPlayerId : player!.id;

              const answersCount = Math.abs(res1.length - res2.length);

              for (let i = 0; i < answersCount; i++) {
                const answeredQuestionCount =
                  await this.quizRepository.getUserAnsweredQuestionCount(
                    playerIdforFill,
                    game.id,
                  );
                // if (!player || answeredQuestionCount === 5) {
                //   ;
                //   throw new ForbiddenException();
                // }
                // ;
                const question =
                  await this.quizRepository.getQuestionByGameIdAndPosition(
                    game.id,
                    answeredQuestionCount as number,
                  );

                if (!question?.id) {
                }

                //
                const playerAnswer = new AnswersForGameEntity(
                  generateUuidV4(),
                  { id: playerIdforFill } as PlayerEntity,
                  { id: question.id } as QuizQuestionsEntity,
                  'Incorrect',
                  new Date(),
                  '',
                  game,
                );
                await this.quizRepository.writeAnswerForPlayer(playerAnswer);
              }

              let res = checkAnswersAndTime(res1, res2, 'after');
              if (!res) {
                res = checkAnswersAndTime(res2, res1, 'after');
              }

              if (res?.playerId) {
                const pl = [otherPlayer, player].find(
                  (p) => p!.id === res?.playerId,
                );
                await this.quizRepository.updatePlayerScore(pl!);
              }

              let loser;
              let winner;

              player!.score > otherPlayer!.score
                ? ((winner = player), (loser = otherPlayer))
                : otherPlayer!.score > player!.score
                  ? ((loser = player), (winner = otherPlayer))
                  : null;

              const result = new GameResultEntity(
                generateUuidV4(),
                game,
                winner || null,
                winner?.user || null,
                loser || null,
                loser?.user || null,
                !winner,
              );

              try {
                await this.quizRepository.addGameStatistic(result);
              } catch (e) {
                console.log(e);
                help.debug = true;
                help.d();
              }
              //
              await this.quizRepository.finishedGame(game);

              // throw new ForbiddenException()
            }
          },
          10000,
          { game, userId, help },
        );

        // await this.quizRepository.setDatePlayerCompletedAllQuestions(game)
      } else if (
        answeredQuestionCountOtherPlayer === 5 &&
        answeredQuestionCountAfterResponse === 5
      ) {
        const game = await this.quizRepository.findActiveGameByPlayerId(
          player?.id,
        );

        if (game.status !== 'Finished') {
          const res1 = await this.quizRepository.getPlayerAnsweredQuestion(
            player.id,
            true,
          );
          const res2 = await this.quizRepository.getPlayerAnsweredQuestion(
            otherPlayerId,
            true,
          );
          let res = checkAnswersAndTime(res1, res2);

          if (!res) {
            res = checkAnswersAndTime(res2, res1);
          }

          if (res) {
            const pl = [otherPlayer, player].find(
              (p) => p!.id === res?.playerId,
            );
            await this.quizRepository.updatePlayerScore(pl!);
          }

          let loser;
          let winner;
          player.score > otherPlayer!.score
            ? ((winner = player), (loser = otherPlayer))
            : otherPlayer!.score > player.score
              ? ((loser = player), (winner = otherPlayer))
              : null;
          const result = new GameResultEntity(
            generateUuidV4(),
            game,
            winner || null,
            winner?.user || null,
            loser || null,
            loser?.user || null,
            !winner,
          );

          try {
            await this.quizRepository.addGameStatistic(result);
          } catch (e) {
            console.log(e);
          }

          await this.quizRepository.finishedGame(game);
        }

        return {
          questionId: question.id,
          answerStatus: playerResponseStatus,
          addedAt,
        };
      }
    }
  }
}
