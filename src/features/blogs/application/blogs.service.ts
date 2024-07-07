import { Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { QueryParams } from '../../../shared/common-types';
import { BlogsRepository } from 'src/features/blogs/infrastructure/blogs-repository';
import { BlogsQueryRepository } from 'src/features/blogs/infrastructure/blogs.query-repository';
import { UpdateBlogDto } from 'src/features/blogs/api/models/update-blog.dto';
import { CreateBlogDto } from 'src/features/blogs/api/models/create-blog.dto';
import { Blog } from 'src/features/blogs/domain/blogs-schema';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { CreatePostDtoWithoutBlogId } from 'src/features/posts/api/models/create-post.dto';
import { PostsService } from 'src/features/posts/application/posts.service';

@Injectable()
export class BlogsService {
  constructor(
    @Inject() protected blogsRepository: BlogsRepository,
    @Inject() protected postsService: PostsService,
    @Inject() protected blogsQueryRepository: BlogsQueryRepository,
    @Inject() protected postsQueryRepository: PostsQueryRepository,
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    const _id = new ObjectId();
    const newBlog: Blog = {
      _id,
      id: _id.toString(),
      createdAt: new Date().toISOString(),
      isMembership: false,
      websiteUrl: createBlogDto.websiteUrl,
      name: createBlogDto.name,
      description: createBlogDto.description,
    };

    return await this.blogsRepository.createBlog(newBlog);
  }

  async findPostsForSpecificBlog(params: QueryParams, blogId: string) {
    return await this.postsQueryRepository.findPostsForSpecificBlog(
      params,
      blogId,
    );
  }

  async createPostsForSpecificBlog(
    createPostDto: CreatePostDtoWithoutBlogId,
    blogId: string,
  ) {
    return await this.postsService.create({ ...createPostDto, blogId });
  }

  async findAll(params: QueryParams) {
    return await this.blogsQueryRepository.findAll(params);
  }

  async findOne(id: string) {
    return await this.blogsQueryRepository.getBlogById(id, true);
  }

  async updateOne(id: string, updateBlogDTO: UpdateBlogDto) {
    return await this.blogsRepository.updateBlog(id, updateBlogDTO);
  }

  remove(id: string) {
    return this.blogsRepository.removeBlogById(id);
  }
}
