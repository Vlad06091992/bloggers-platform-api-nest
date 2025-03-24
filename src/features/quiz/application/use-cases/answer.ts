import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from 'src/features/quiz/infrastructure/quiz-repository';
import { PlayerEntity } from 'src/features/quiz/entities/player.entity';
import { generateUuidV4 } from 'src/utils';
import { UsersEntity } from 'src/features/users/entities/users.entity';
import { ForbiddenException } from '@nestjs/common';
import { GameEntity } from 'src/features/quiz/entities/game.entity';
import { QuizQuestionRepository } from 'src/features/quizQuestions/infrastructure/quiz-question-repository';
import { QuestionsForGameEntity } from 'src/features/quiz/entities/questions-for-game.entity';
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
  //проверяем, могут ли ответы первого игрока подходить под условия

  console.log('--------------------------------');
  console.log('checkAnswersAndTime');
  console.log('questionOne', questionOne);
  console.log('questionTwo', questionTwo);
  console.log('--------------------------------');

  let isExistCorrectAnswerFirstPlayer = false;
  let allAnswersFaster = false;

  // const lastQuestionOne = questionOne[questionOne.length - 1];
  // const lastQuestionTwo = questionOne[questionTwo.length - 1];

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
      debugger;
      return {
        isExistCorrectAnswerFirstPlayer,
        allAnswersFaster,
        playerId: questionOne[0].playerId,
      };
    } else {
      return null;
    }
  } catch (e) {
    debugger;
    return null;
  }
};

// const checkAnswersAndTime = (
//   questionOne: AnswersAndTime,
//   questionTwo: AnswersAndTime,
// ): {
//   isExistCorrectAnswerFirstPlayer: true;
//   allAnswersFaster: true;
//   playerId: string;
// } | null => {
//   //проверяем, могут ли ответы первого игрока подходить под условия
//
//   console.log('--------------------------------');
//   console.log('checkAnswersAndTime');
//   console.log('questionOne', questionOne);
//   console.log('questionTwo', questionTwo);
//   console.log('--------------------------------');
//
//   let isExistCorrectAnswerFirstPlayer = false;
//   let allAnswersFaster = true;
//
//   for (let i = 0; i < questionOne.length; i++) {
//     const curr1 = questionOne[i];
//     const curr2 = questionTwo[i];
//
//     if (curr1.addedAt < curr2.addedAt) allAnswersFaster = false;
//     if (curr1.status === 'Correct') isExistCorrectAnswerFirstPlayer = true;
//   }
//
//   if (isExistCorrectAnswerFirstPlayer && allAnswersFaster)
//     return {
//       isExistCorrectAnswerFirstPlayer,
//       allAnswersFaster,
//       playerId: questionOne[0].playerId,
//     };
//
//   isExistCorrectAnswerFirstPlayer = false;
//   allAnswersFaster = true;
//
//   for (let i = 0; i < questionOne.length; i++) {
//     const curr1 = questionOne[i];
//     const curr2 = questionTwo[i];
//
//     if (curr1.addedAt > curr2.addedAt) allAnswersFaster = false;
//     if (curr2.status === 'Correct') isExistCorrectAnswerFirstPlayer = true;
//   }
//
//   if (isExistCorrectAnswerFirstPlayer && allAnswersFaster)
//     return {
//       isExistCorrectAnswerFirstPlayer,
//       allAnswersFaster,
//       playerId: questionTwo[0].playerId,
//     };
//
//   return null;
// };

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

    //1) определяем,ответ на какой вопрос ждем от игрока
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

    //2 ищем вопрос
    const question = await this.quizRepository.getQuestionByGameIdAndPosition(
      game.id,
      answeredQuestionCount as number,
    );
    //сравниваем, правильно ли ответил игрок
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

    //если правильно, записываем очко игроку
    if (isCorrect) {
      await this.quizRepository.updatePlayerScore(player);
    }

    const answeredQuestionCountOtherPlayer =
      await this.quizRepository.getUserAnsweredQuestionCount(
        otherPlayerId,
        game.id,
      );

    console.log(
      'answeredQuestionCountOtherPlayer',
      answeredQuestionCountOtherPlayer,
    );
    console.log(
      'answeredQuestionCountAfterResponse',
      answeredQuestionCountAfterResponse,
    );

    if (
      // answeredQuestionCountOtherPlayer &&
      // answeredQuestionCountOtherPlayer >= 5 &&
      // answeredQuestionCountAfterResponse >= 5

      answeredQuestionCountOtherPlayer === 5 &&
      answeredQuestionCountAfterResponse === 5
    ) {
      //закончить игру, определить лучшего игрока

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
