import { Module } from '@nestjs/common';
import { TestingController } from 'src/features/testing/testing.controller';
import { TestingService } from 'src/features/testing/testing.service';
import { MongoModule } from 'src/mongo-module/mongo.module';
import { UsersRepository } from 'src/features/users/infrastructure/users-repository';
import { CommentsRepository } from 'src/features/comments/infrastructure/comments-repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/features/users/domain/user-schema';
import {
  Comment,
  CommentsSchema,
} from 'src/features/comments/domain/comments-schema';
import { PostsRepository } from 'src/features/posts/infrastructure/posts-repository';
import { Post, PostsSchema } from 'src/features/posts/domain/posts-schema';
import { BlogsRepository } from 'src/features/sa_blogs/infrastructure/blogs-repository';

import {
  AuthDevices,
  AuthDevicesSchema,
} from 'src/features/auth/domain/devices-schema';
import { AuthDevicesRepository } from 'src/features/auth/infrastructure/auth-devices-repository';
import { OldTokensIdsRepository } from 'src/features/auth/infrastructure/old-tokens-ids-repository';
import {
  OldTokensIds,
  OldTokensIdsSchema,
} from 'src/features/auth/domain/old-tokens-id-schema';
import { CommentsLikesRepository } from 'src/features/comments-likes/infrastructure/comments-likes-repository';
import { PostsLikesRepository } from 'src/features/posts-likes/infrastructure/posts-likes-repository';

@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentsSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostsSchema }]),
    // MongooseModule.forFeature([
    //   { name: CommentLikes.name, schema: LikesSchema },
    // ]),
    MongooseModule.forFeature([
      { name: OldTokensIds.name, schema: OldTokensIdsSchema },
    ]),
    MongooseModule.forFeature([
      { name: AuthDevices.name, schema: AuthDevicesSchema },
    ]),
  ],
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
