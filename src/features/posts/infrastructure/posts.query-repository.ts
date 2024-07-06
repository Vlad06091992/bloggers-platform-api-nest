import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { QueryParams } from 'src/shared/common-types';
import { Post, PostModel } from 'src/features/posts/domain/posts-schema';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: PostModel) {}

  async getPostById(id: string, isViewModel: boolean) {
    const projection = isViewModel
      ? {
          _id: 0,
          password: 0,
          registrationData: 0,
          __v: 0,
        }
      : {};

    return await this.postModel
      .findOne({ _id: new ObjectId(id) }, projection)
      .exec();
  }

  async removePostById(id: string) {
    const _id = new ObjectId(id);
    const res = await this.postModel.deleteOne({ _id }).exec();
    return res.deletedCount === 1;
  }

  // async findUserByEmailOrLogin(emailOrLogin: string) {
  //   return this.postModel.findOne({
  //     $or: [{ email: emailOrLogin }, { login: emailOrLogin }],
  //   });
  // }
  async findAll(params: QueryParams) {
    const projection = { _id: 0, password: 0, registrationData: 0, __v: 0 };
    return this.postModel.pagination(params, projection);
  }
}
