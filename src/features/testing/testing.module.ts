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
import { OldTokensIds } from 'src/features/auth/entities/old-tokens-ids';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthDevices } from 'src/features/auth/entities/devices';
import { AuthDevicesQueryRepository } from 'src/features/auth/infrastructure/auth-devices-query-repository';
import { Users } from 'src/features/users/entities/users';
import { UsersRegistrationData } from 'src/features/users/entities/users-registration-data';
import { Blogs } from 'src/features/blogs/entity/blogs';
import { Posts } from 'src/features/posts/entity/posts';
import { PostsReactions } from 'src/features/posts-reactions/entity/post-reactions';
import { Comments } from 'src/features/comments/entity/comments';
import { CommentsReactions } from 'src/features/comments-reactions/entity/comment-reactions';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OldTokensIds,
      AuthDevices,
      Users,
      UsersRegistrationData,
      Blogs,
      Posts,
      PostsReactions,
      Comments,
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
  ],
})
export class TestModule {}
