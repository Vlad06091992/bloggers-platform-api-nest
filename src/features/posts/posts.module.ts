import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModule } from 'src/mongo-module/mongo.module';
import { Post, PostsSchema } from 'src/features/posts/domain/posts-schema';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { PostsController } from 'src/features/posts/api/posts.controller';
import { PostsRepository } from 'src/features/posts/infrastructure/posts-repository';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';
import {
  CommentsSchema,
  Comment,
} from 'src/features/comments/domain/comments-schema';
import { PostsService } from 'src/features/posts/application/posts.service';

@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([{ name: Post.name, schema: PostsSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentsSchema }]),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    CommentsQueryRepository,
  ],
})
export class PostsModule {}
