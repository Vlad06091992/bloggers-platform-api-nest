import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from 'src/features/quiz/infrastructure/quiz-repository';
import { PlayerEntity } from 'src/features/quiz/entities/player.entity';
import { generateUuidV4 } from 'src/utils';
import { ForbiddenException } from '@nestjs/common';
import { QuizQuestionRepository } from 'src/features/quizQuestions/infrastructure/quiz-question-repository';
import { QuizQuestionsEntity } from 'src/features/quizQuestions/entity/quiz-questions.entity';
import { AnswersForGameEntity } from 'src/features/quiz/entities/answers-for-game.entity';

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
): {
  isExistCorrectAnswerFirstPlayer: true;
  allAnswersFaster: true;
  playerId: string;
} | null => {
  let isExistCorrectAnswerFirstPlayer = false;
  let allAnswersFaster = false;

  const lastQuestionOne = questionOne[4];
  const lastQuestionTwo = questionTwo[4];

  try {
    if (
      new Date(lastQuestionOne.addedAt).getTime() <
      new Date(lastQuestionTwo.addedAt).getTime()
    ) {
      allAnswersFaster = true;
    }
    for (let i = 0; i < questionOne.length; i++) {
      const curr1 = questionOne[i];
      if (curr1.answerStatus === 'Correct') {
        isExistCorrectAnswerFirstPlayer = true;
      }
    }

    if (isExistCorrectAnswerFirstPlayer && allAnswersFaster) {
      return {
        isExistCorrectAnswerFirstPlayer,
        allAnswersFaster,
        playerId: questionOne[0].playerId,
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
    const player = await this.quizRepository.findPlayerByUserId(userId);

    const game = await this.quizRepository.findActiveGameByPlayerId(player?.id);

    if (!game) {
      throw new ForbiddenException();
    }

    const answeredQuestionCount =
      await this.quizRepository.getUserAnsweredQuestionCount(
        player?.id,
        game.id,
      );

    if (!player || answeredQuestionCount === 5) {
      throw new ForbiddenException();
    }

    const otherPlayer = (game, playerId: string) => {
      const { player1id, player2id } = game;
      return playerId === player1id ? player2id : player1id;
    };

    const otherPlayerId = otherPlayer(game, player.id);

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

    if (
      answeredQuestionCountOtherPlayer === 5 &&
      answeredQuestionCountAfterResponse === 5
    ) {
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
        const player = await this.quizRepository.findPlayerById(res.playerId);
        await this.quizRepository.updatePlayerScore(player!);
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
