import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModule } from 'src/mongo-module/mongo.module';
import { Post, PostsSchema } from 'src/features/posts/domain/posts-schema';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { PostsController } from 'src/features/posts/api/posts.controller';
import { PostsService } from 'src/features/posts/application/posts.service';
import { PostsRepository } from 'src/features/posts/infrastructure/posts-repository';

@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([{ name: Post.name, schema: PostsSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, PostsQueryRepository],
})
export class PostsModule {}
