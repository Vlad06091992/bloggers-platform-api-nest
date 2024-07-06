import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Post, PostModel } from 'src/features/posts/domain/posts-schema';
import { UpdatePostDto } from 'src/features/posts/api/models/update-post.dto';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: PostModel) {}

  async createPost(post: Post) {
    const res = (await this.postModel.create(post)).toObject();
    return res;
  }

  async updatePost(id: string, post: UpdatePostDto) {
    const res = await this.postModel.updateOne({ id }, { $set: post }).exec();
    return res.matchedCount == 1;
  }

  async clearData() {
    await this.postModel.deleteMany({});
  }
}
