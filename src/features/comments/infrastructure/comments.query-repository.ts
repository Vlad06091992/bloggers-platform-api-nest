import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CommentModel, Comment } from '../domain/comments-schema';

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectModel(Comment.name) private commentsModel: CommentModel) {}

  async getCommentById(id: string, isViewModel: boolean) {
    const projection = isViewModel
      ? {
          _id: 0,
          __v: 0,
        }
      : {};

    const result = await this.commentsModel
      .findOne({ _id: new ObjectId(id) }, projection)
      .exec();
    return result;
  }
}
