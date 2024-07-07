import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Blog, BlogModel } from 'src/features/blogs/domain/blogs-schema';
import { ObjectId } from 'mongodb';
import { UpdateBlogDto } from 'src/features/blogs/api/models/update-blog.dto';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogModel) {}

  async createBlog(blog: Blog) {
    const res = (await this.blogModel.create(blog)).toObject();
    return res;
  }

  async updateBlog(id: string, blog: UpdateBlogDto) {
    const res = await this.blogModel.updateOne({ id }, { $set: blog }).exec();
    return res.matchedCount == 1;
  }

  async removeBlogById(id: string) {
    const _id = new ObjectId(id);
    const res = await this.blogModel.deleteOne({ _id }).exec();

    return res.deletedCount === 1;
  }

  async clearData() {
    await this.blogModel.deleteMany({});
  }
}
