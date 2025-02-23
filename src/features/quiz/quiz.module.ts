import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { QuizController } from 'src/features/quiz/api/quiz-controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerEntity } from 'src/features/quiz/entities/player.entity';
import { GameEntity } from 'src/features/quiz/entities/game.entity';
import { ConnectionHandler } from 'src/features/quiz/application/use-cases/connection';
import { QuizRepository } from 'src/features/quiz/infrastructure/quiz-repository';
import { QuizQuestionRepository } from 'src/features/quizQuestions/infrastructure/quiz-question-repository';
import { QuizQuestionsEntity } from 'src/features/quizQuestions/entity/quiz-questions.entity';
import { QuestionsForGameEntity } from 'src/features/quiz/entities/questions-for-game.entity';
import { AnswerHandler } from 'src/features/quiz/application/use-cases/answer';
import { AnswersForGameEntity } from 'src/features/quiz/entities/answers-for-game.entity';
import {
  GetGameExtendedInfoCommand,
  GetGameExtendedInfoHandler,
} from 'src/features/quiz/application/use-cases/get-game-extended-info';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      PlayerEntity,
      GameEntity,
      QuizQuestionsEntity,
      QuestionsForGameEntity,
      AnswersForGameEntity,
    ]),
  ],
  controllers: [QuizController],
  providers: [
    ConnectionHandler,
    AnswerHandler,
    QuizRepository,
    QuizQuestionRepository,
    GetGameExtendedInfoHandler,
  ],
})
export class QuizModule {}
