import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CommentModel, Comment } from '../domain/comments-schema';

@Injectable()
export class CommentsRepository {
  constructor(@InjectModel(Comment.name) private commentModel: CommentModel) {}

  async clearData() {
    await this.commentModel.deleteMany({});
  }

  // async createUser(user: User) {
  //   const res = await this.userModel.insertMany([user]);
  //
  //   const { email, id, login, createdAt } = res[0];
  //
  //   return { email, id, login, createdAt };
  // }
}
