import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModule } from 'src/mongo-module/mongo.module';
import { CommentsController } from 'src/features/comments/api/commentsController';
import { CommentsService } from 'src/features/comments/application/comments.service';
import { CommentsRepository } from 'src/features/comments/infrastructure/comments-repository';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';
import { Comment, CommentsSchema } from './domain/comments-schema';

@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentsSchema }]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository, CommentsQueryRepository],
})
export class CommentsModule {}
