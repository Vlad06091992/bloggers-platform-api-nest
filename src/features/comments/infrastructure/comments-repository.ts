import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CommentModel, Comment } from '../domain/comments-schema';

@Injectable()
export class CommentsRepository {
  constructor(@InjectModel(Comment.name) private commentModel: CommentModel) {}

  async clearData() {
    await this.commentModel.deleteMany({});
  }
}
