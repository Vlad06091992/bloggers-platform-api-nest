import { Inject, Injectable } from '@nestjs/common';
import { CommentsRepository } from 'src/features/comments/infrastructure/comments-repository';
import { UsersRepository } from 'src/features/users/infrastructure/users-repository';
import { PostsRepository } from 'src/features/posts/infrastructure/posts-repository';
import { BlogsRepository } from 'src/features/blogs/infrastructure/blogs-repository';

@Injectable()
export class TestingService {
  constructor(
    @Inject() protected usersRepository: UsersRepository,
    @Inject() protected postsRepository: PostsRepository,
    @Inject() protected blogsRepository: BlogsRepository,
    @Inject() protected commentsRepository: CommentsRepository,
  ) {}

  async clearDatabase() {
    try {
      await this.commentsRepository.clearData();
      await this.usersRepository.clearData();
      await this.postsRepository.clearData();
      await this.blogsRepository.clearData();
      return true;
    } catch (e) {
      return false;
    }
  }
}
