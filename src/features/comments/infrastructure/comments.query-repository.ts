import { InjectModel } from '@nestjs/mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { Comment, CommentModel } from '../domain/comments-schema';
import { QueryParams } from 'src/shared/common-types';
import { ObjectId } from 'mongodb';
import { CommandBus } from '@nestjs/cqrs';
import { GetLikeInfoCommand } from 'src/features/likes/application/use-cases/get-like-info';

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectModel(Comment.name) private commentsModel: CommentModel) {}

  async getCommentById(id: string, isViewModel: boolean) {
    const result = await this.commentsModel.findOne({ id }).exec();
    return isViewModel ? result?.toObject() : result;
  }
  async getCommentsForPost(postId: string, params: QueryParams) {
    const filter = { postId };

    const result = await this.commentsModel.pagination(
      params,
      filter,
      {},
      (doc) => doc.toObject(),
    );
    return result;
  }
}
