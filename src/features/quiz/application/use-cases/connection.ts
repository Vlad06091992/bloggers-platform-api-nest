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
  ) {}

  async execute({ userId, userLogin }: ConnectionCommand) {
    const isAlreadyPendingPlayer =
      await this.quizRepository.isAlreadyPendingPlayer(userId);

    if (isAlreadyPendingPlayer) {
      throw new ForbiddenException();
    }

    const newPlayer = new PlayerEntity(
      generateUuidV4(),
      'pendingSecondPlayer',
      null,
      new Date(),
      { id: userId } as UsersEntity,
      userLogin,
    );

    await this.quizRepository.createPlayer(newPlayer);

    const lastCreatedGame = await this.quizRepository.getLastCreatedGame();
    if (!lastCreatedGame || lastCreatedGame.status !== 'pendingSecondPlayer') {
      const game = new GameEntity(
        generateUuidV4(),
        { id: newPlayer.id } as PlayerEntity,
        null,
        new Date(),
        'pendingSecondPlayer',
      );
      await this.quizRepository.createGame(game);
      await this.quizRepository.setGameForPlayer(newPlayer, game);
      debugger;
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
    } else {
      const game = await this.quizRepository.addSecondPlayerForGame(
        lastCreatedGame!,
        newPlayer,
      );
      await this.quizRepository.setGameForPlayer(newPlayer, game!);
      await this.quizRepository.updatePlayerStatus(newPlayer, 'active');
      await this.quizRepository.updatePlayerStatus(game!.player1!, 'active');
    }
  }
}

// import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import { QuizRepository } from 'src/features/quiz/infrastructure/quiz-repository';
// import { PlayerEntity } from 'src/features/quiz/entities/player.entity';
// import { generateUuidV4 } from 'src/utils';
// import { UsersEntity } from 'src/features/users/entities/users.entity';
// import { ForbiddenException } from '@nestjs/common';
// import { GameEntity } from 'src/features/quiz/entities/game.entity';
// import { QuizQuestionRepository } from 'src/features/quizQuestions/infrastructure/quiz-question-repository';
// import { QuestionsForGameEntity } from 'src/features/quiz/entities/questions-for-game.entity';
// import { QuizQuestionsEntity } from 'src/features/quizQuestions/entity/quiz-questions.entity';
//
// export class ConnectionCommand {
//   constructor(
//     public userId: string,
//     public userLogin: string,
//   ) {}
// }
//
// @CommandHandler(ConnectionCommand)
// export class ConnectionHandler implements ICommandHandler<ConnectionCommand> {
//   constructor(
//     protected quizRepository: QuizRepository,
//     protected quizQuestionRepository: QuizQuestionRepository,
//   ) {}
//
//   async execute({ userId, userLogin }: ConnectionCommand) {
//     /* коннектится игрок
//     создается игра
//     присоединяется второй игрок
//
//
//     */
//
//     const isAlreadyPendingPlayer =
//       await this.quizRepository.isAlreadyPendingPlayer(userId);
//
//     if (isAlreadyPendingPlayer) {
//       throw new ForbiddenException();
//     }
//
//     const lastConnectedPlayer =
//       await this.quizRepository.getLastConnectedPlayer();
//     console.log('lastConnectedPlayer', lastConnectedPlayer);
//
//     const newPlayer = new PlayerEntity(
//       generateUuidV4(),
//       'pending',
//       null,
//       new Date(),
//       { id: userId } as UsersEntity,
//       userLogin,
//     );
//
//     await this.quizRepository.createPlayer(newPlayer);
//
//     if (lastConnectedPlayer?.status === 'pending') {
//       const game = new GameEntity(
//         generateUuidV4(),
//         { id: lastConnectedPlayer.id },
//         { id: newPlayer.id },
//         new Date(),
//         'active',
//       );
//
//       await this.quizRepository.createGame(game);
//
//       //двум игрокам, последнему,и который ждал меняем статус на active
//       await this.quizRepository.updatePlayerStatus(newPlayer, 'active');
//       await this.quizRepository.updatePlayerStatus(
//         lastConnectedPlayer,
//         'active',
//       );
//
//       //двум игрокам, последнему,и который ждал
//       await this.quizRepository.setGameForPlayer(newPlayer, game);
//       await this.quizRepository.setGameForPlayer(lastConnectedPlayer, game);
//
//       const questions = await this.quizQuestionRepository.getRandomQuestions(5);
//       debugger;
//       const questionsWithPosition: QuestionsForGameEntity[] = questions.map(
//         (el, i) => ({
//           question: { id: el.id } as QuizQuestionsEntity,
//           game: { id: game.id } as GameEntity,
//           position: i,
//           createdAt: new Date(),
//           id: generateUuidV4(),
//         }),
//       );
//
//       await this.quizRepository.setQuestionsForGame(questionsWithPosition);
//     }
//
//     return true;
//   }
// }
