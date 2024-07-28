import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { QueryParams } from 'src/shared/common-types';
import { Blog, BlogModel } from 'src/features/blogs/domain/blogs-schema';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogModel) {}

  async getBlogById(id: string, isViewModel: boolean) {
    const projection = isViewModel
      ? {
          _id: 0,
          __v: 0,
        }
      : {};

    return await this.blogModel
      .findOne({ _id: new ObjectId(id) }, projection)
      .exec();
  }

  async findAll(params: QueryParams) {
    const projection = { _id: 0, password: 0, registrationData: 0, __v: 0 };

    const filter = params.searchNameTerm
      ? { name: { $regex: params.searchNameTerm, $options: 'i' } }
      : {};

    return this.blogModel.pagination(params, filter, projection);
  }
}
