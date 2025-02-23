import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { QuizQuestionsController } from 'src/features/quizQuestions/api/quiz-questions-controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizQuestionsEntity } from 'src/features/quizQuestions/entity/quiz-questions.entity';
import { CreateQuestionHandler } from 'src/features/quizQuestions/application/use-cases/create-question';
import { QuizQuestionRepository } from 'src/features/quizQuestions/infrastructure/quiz-question-repository';
import { DeleteQuestionHandler } from 'src/features/quizQuestions/application/use-cases/delete-question';
import { UpdateQuestionHandler } from 'src/features/quizQuestions/application/use-cases/update-question';
import { PublishQuestionHandler } from 'src/features/quizQuestions/application/use-cases/publish-question';
import { GetQuestionHandler } from 'src/features/quizQuestions/application/use-cases/get-question';
import { GameEntity } from 'src/features/quiz/entities/game.entity';
import { PlayerEntity } from 'src/features/quiz/entities/player.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([QuizQuestionsEntity, PlayerEntity, GameEntity]),
  ],
  controllers: [QuizQuestionsController],
  providers: [
    CreateQuestionHandler,
    UpdateQuestionHandler,
    DeleteQuestionHandler,
    GetQuestionHandler,
    PublishQuestionHandler,
    QuizQuestionRepository,
  ],
})
export class QuizQuestionsModule {}
