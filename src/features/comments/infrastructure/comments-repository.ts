import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CommentModel, Comment } from '../domain/comments-schema';
import { ObjectId } from 'mongodb';

@Injectable()
export class CommentsRepository {
  constructor(@InjectModel(Comment.name) private commentModel: CommentModel) {}

  // async createUser(user) {
  //   const res = await this.userModel.insertMany([user]);
  //   const { email, id, login, createdAt } = res[0];
  //   return { email, id, login, createdAt };
  // }

  async updateCommentById(commentId: string, content: string) {
    const result = await this.commentModel
      .updateOne({ id: commentId }, { $set: { content } })
      .exec();
    return result.matchedCount === 1;
  }
  async createComment(comment: Comment) {
    return (await this.commentModel.create(comment)).toObject();
  }
  async removeCommentById(id: string) {
    const _id = new ObjectId(id);
    const res = await this.commentModel.deleteOne({ _id }).exec();
    return res.deletedCount === 1;
  }
  async clearData() {
    await this.commentModel.deleteMany({});
  }
}
