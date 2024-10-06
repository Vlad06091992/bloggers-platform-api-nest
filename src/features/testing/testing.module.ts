import { Module } from '@nestjs/common';
import { TestingController } from 'src/features/testing/testing.controller';
import { TestingService } from 'src/features/testing/testing.service';
import { UsersRepository } from 'src/features/users/infrastructure/users-repository';
import { CommentsRepository } from 'src/features/comments/infrastructure/comments-repository';
import { PostsRepository } from 'src/features/posts/infrastructure/posts-repository';
import { BlogsRepository } from 'src/features/blogs/infrastructure/blogs-repository';
import { AuthDevicesRepository } from 'src/features/auth/infrastructure/auth-devices-repository';
import { OldTokensIdsRepository } from 'src/features/auth/infrastructure/old-tokens-ids-repository';
import { CommentsLikesRepository } from 'src/features/comments-likes/infrastructure/comments-likes-repository';
import { PostsLikesRepository } from 'src/features/posts-likes/infrastructure/posts-likes-repository';
import { OldTokensIds } from 'src/features/auth/entities/old-tokens-ids';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthDevices } from 'src/features/auth/entities/devices';
import { AuthDevicesQueryRepository } from 'src/features/auth/infrastructure/auth-devices-query-repository';
import { User } from 'src/features/users/entities/user';
import { UserRegistrationData } from 'src/features/users/entities/user-registration-data';
import { Blogs } from 'src/features/blogs/entity/blogs';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OldTokensIds,
      AuthDevices,
      User,
      UserRegistrationData,
      Blogs,
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
    PostsLikesRepository,
    AuthDevicesRepository,
    AuthDevicesQueryRepository,
  ],
})
export class TestModule {}
