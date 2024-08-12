import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Comment, CommentModel } from '../domain/comments-schema';
import { QueryParams } from 'src/shared/common-types';

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
