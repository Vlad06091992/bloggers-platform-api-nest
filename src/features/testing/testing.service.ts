import { Inject, Injectable } from '@nestjs/common';
import { CommentsRepository } from 'src/features/comments/infrastructure/comments-repository';
import { UsersRepository } from 'src/features/users/infrastructure/users-repository';

@Injectable()
export class TestingService {
  constructor(
    @Inject() protected usersRepository: UsersRepository,

    @Inject() protected commentsRepository: CommentsRepository,
  ) {}

  async clearDatabase() {
    try {
      await this.commentsRepository.clearData();
      await this.usersRepository.clearData();
      return true;
    } catch (e) {
      return false;
    }
  }
}
