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

@CommandHandler(AnswerCommand)
export class AnswerHandler implements ICommandHandler<AnswerCommand> {
  constructor(
    protected quizRepository: QuizRepository,
    protected quizQuestionRepository: QuizQuestionRepository,
  ) {}

  async execute({ userId, answer }: AnswerCommand) {
    // console.log('userId', userId);
    // console.log('answer', answer);
    // // userId 7dad3245-6265-4992-855b-2c7020555a77
    // // answer my answer
    //
    // debugger;
    const player = await this.quizRepository.findPlayerByUserId(userId);

    if (!player) {
      throw new ForbiddenException();
    }

    // debugger;
    // // player PlayerEntity {
    // //   id: '3f707a53-af27-4f2a-a8d2-998b33d7b84d',
    // //     user: undefined,
    // //     game: undefined,
    // //     status: 'active',
    // //     createdAt: 2025-02-13T05:34:09.839Z,
    // //     score: 0
    // // }
    //
    const game = await this.quizRepository.findActiveGameByPlayerId(player!.id);
    // // game {
    // //   id: '0a950b2f-f725-4376-915c-017c84dd1d5f',
    // //     createdat: 2025-02-13T05:34:12.873Z,
    // //     player1id: 'f750bb76-de96-4fd6-ae5a-93278495ae7f',
    // //     player2id: '3f707a53-af27-4f2a-a8d2-998b33d7b84d',
    // //     status: 'active'
    // // }

    const questions = await this.quizRepository.getQuestionsByGameId(game.id);

    debugger;
    // console.log('player', player);
    // console.log('game', game);
    console.log('questions', questions);

    //нужно определить, на какой вопрос был дан ответ игроком, и правильный ли он

    //1) определяем,ответ на какой вопрос ждем от игрока
    const answeredQuestionCount =
      await this.quizRepository.getUserAnsweredQuestionCount(player?.id);
    //2 ищем вопрос
    const question = await this.quizRepository.getQuestionByGameIdAndPosition(
      game.id,
      answeredQuestionCount,
    );
    console.log('question', question);
    console.log('correctanswers', question.correctanswers);
    console.log('answers', answer);
    debugger;

    //сравниваем, правильно ли ответил игрок
    const isCorrect = question.correctanswers.find((a) => a === answer);
    console.log('isCorrect', !!isCorrect);

    //если правильно, записываем очко игроку
    if (isCorrect) {
      await this.quizRepository.updatePlayerScore(player);
    }

    //записываем ответ юзера

    const playerResponseStatus = isCorrect ? 'Correct' : 'Incorrect';
    const playerAnswer = new AnswersForGameEntity(
      generateUuidV4(),
      { id: player.id } as PlayerEntity,
      { id: question.id } as QuizQuestionsEntity,
      playerResponseStatus,
      new Date(),
      answer,
    );
    debugger;
    await this.quizRepository.writeAnswerForPlayer(playerAnswer);

    return {
      questionId: question.id,
      answerStatus: playerResponseStatus,
      addedAt: new Date(),
    };
  }
}
