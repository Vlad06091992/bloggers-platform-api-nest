import { Module } from '@nestjs/common';
import { TestingController } from 'src/features/testing/testing.controller';
import { TestingService } from 'src/features/testing/testing.service';
import { UsersRepository } from 'src/features/users/infrastructure/users-repository';
import { CommentsRepository } from 'src/features/comments/infrastructure/comments-repository';
import { PostsRepository } from 'src/features/posts/infrastructure/posts-repository';
import { BlogsRepository } from 'src/features/sa_blogs/infrastructure/blogs-repository';
import { AuthDevicesRepository } from 'src/features/auth/infrastructure/auth-devices-repository';
import { OldTokensIdsRepository } from 'src/features/auth/infrastructure/old-tokens-ids-repository';
import { CommentsLikesRepository } from 'src/features/comments-likes/infrastructure/comments-likes-repository';
import { PostsLikesRepository } from 'src/features/posts-likes/infrastructure/posts-likes-repository';

@Module({
  imports: [],
  controllers: [TestingController],
  providers: [
    TestingService,
    UsersRepository,
    CommentsRepository,
    PostsRepository,
    BlogsRepository,
    CommentsLikesRepository,
    PostsLikesRepository,
    AuthDevicesRepository,
    OldTokensIdsRepository,
  ],
})
export class TestModule {}
