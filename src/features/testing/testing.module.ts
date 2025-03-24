import { Module } from '@nestjs/common';
import { TestingController } from 'src/features/testing/testing.controller';
import { TestingService } from 'src/features/testing/testing.service';
import { UsersRepository } from 'src/features/users/infrastructure/users-repository';
import { CommentsRepository } from 'src/features/comments/infrastructure/comments-repository';
import { PostsRepository } from 'src/features/posts/infrastructure/posts-repository';
import { BlogsRepository } from 'src/features/blogs/infrastructure/blogs-repository';
import { AuthDevicesRepository } from 'src/features/auth/infrastructure/auth-devices-repository';
import { OldTokensIdsRepository } from 'src/features/auth/infrastructure/old-tokens-ids-repository';
import { CommentsLikesRepository } from 'src/features/comments-reactions/infrastructure/comments-likes-repository';
import { PostsReactionsRepository } from 'src/features/posts-reactions/infrastructure/posts-reactions-repository';
import { OldTokensIdsEntity } from 'src/features/auth/entities/old-tokens-ids.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthDevicesQueryRepository } from 'src/features/auth/infrastructure/auth-devices-query-repository';
import { UsersEntity } from 'src/features/users/entities/users.entity';
import { UsersRegistrationDataEntity } from 'src/features/users/entities/users-registration-data.entity';
import { BlogsEntity } from 'src/features/blogs/entity/blogs.entity';
import { PostsEntity } from 'src/features/posts/entity/posts.entity';
import { PostsReactions } from 'src/features/posts-reactions/entity/post-reactions.entity';
import { CommentsEntity } from 'src/features/comments/entity/comments.entity';
import { CommentsReactions } from 'src/features/comments-reactions/entity/comment-reactions.entity';
import { AuthDevices } from 'src/features/auth/entities/devices.entity';
import { QuizQuestionRepository } from 'src/features/quizQuestions/infrastructure/quiz-question-repository';
import { QuizRepository } from 'src/features/quiz/infrastructure/quiz-repository';
import { QuizQuestionsEntity } from 'src/features/quizQuestions/entity/quiz-questions.entity';
import { GameEntity } from 'src/features/quiz/entities/game.entity';
import { PlayerEntity } from 'src/features/quiz/entities/player.entity';
import { QuestionsForGameEntity } from 'src/features/quiz/entities/questions-for-game.entity';
import { AnswersForGameEntity } from 'src/features/quiz/entities/answers-for-game.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OldTokensIdsEntity,
      AuthDevices,
      UsersEntity,
      UsersRegistrationDataEntity,
      BlogsEntity,
      PostsEntity,
      PostsReactions,
      CommentsEntity,
      QuizQuestionsEntity,
      GameEntity,
      PlayerEntity,
      QuestionsForGameEntity,
      AnswersForGameEntity,
      CommentsReactions,
    ]),
  ],
  controllers: [TestingController],
  providers: [
    OldTokensIdsRepository,
    TestingService,
    UsersRepository,
    CommentsRepository,
    PostsRepository,
    BlogsRepository,
    CommentsLikesRepository,
    PostsReactionsRepository,
    AuthDevicesRepository,
    AuthDevicesQueryRepository,
    QuizQuestionRepository,
    QuizRepository,
  ],
})
export class TestModule {}
