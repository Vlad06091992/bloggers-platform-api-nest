import { Inject, Injectable } from '@nestjs/common';
import { CommentsRepository } from 'src/features/comments/infrastructure/comments-repository';
import { UsersRepository } from 'src/features/users/infrastructure/users-repository';
import { PostsRepository } from 'src/features/posts/infrastructure/posts-repository';
import { BlogsRepository } from 'src/features/blogs/infrastructure/blogs-repository';
import { CommentsLikesRepository } from 'src/features/comments-reactions/infrastructure/comments-likes-repository';
import { AuthDevicesRepository } from 'src/features/auth/infrastructure/auth-devices-repository';
import { OldTokensIdsRepository } from 'src/features/auth/infrastructure/old-tokens-ids-repository';
import { PostsReactionsRepository } from 'src/features/posts-reactions/infrastructure/posts-reactions-repository';
import { QuizQuestionRepository } from 'src/features/quizQuestions/infrastructure/quiz-question-repository';
import { QuizRepository } from 'src/features/quiz/infrastructure/quiz-repository';

@Injectable()
export class TestingService {
  constructor(
    @Inject() protected usersRepository: UsersRepository,
    @Inject() protected postsRepository: PostsRepository,
    @Inject() protected blogsRepository: BlogsRepository,
    @Inject() protected commentsRepository: CommentsRepository,
    @Inject() protected commentsLikesRepository: CommentsLikesRepository,
    @Inject() protected postsLikesRepository: PostsReactionsRepository,
    @Inject() protected authDevicesRepository: AuthDevicesRepository,
    @Inject() protected oldTokensIdsRepository: OldTokensIdsRepository,
    @Inject() protected quizQuestionRepository: QuizQuestionRepository,
    @Inject() protected quizRepository: QuizRepository,
  ) {}

  async clearDatabase() {
    try {
      await this.authDevicesRepository.clearData();
      await this.postsRepository.clearData();
      await this.commentsRepository.clearData();
      await this.commentsLikesRepository.clearData();
      await this.postsLikesRepository.clearData();
      await this.usersRepository.clearData();
      await this.blogsRepository.clearData();
      await this.oldTokensIdsRepository.clearData();
      await this.quizQuestionRepository.clearData();
      await this.quizRepository.clearData();
      return true;
    } catch (e) {
      return false;
    }
  }
}
