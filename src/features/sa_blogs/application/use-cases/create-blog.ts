import { Inject } from '@nestjs/common';
import { BlogsRepository } from 'src/features/sa_blogs/infrastructure/blogs-repository';

import { CreateBlogDto } from 'src/features/sa_blogs/api/models/create-blog.dto';
import { Blog } from 'src/features/sa_blogs/domain/blogs-schema';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { PostsService } from 'src/features/posts/application/posts.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { generateUuidV4 } from 'src/utils';
import { BlogsQueryRepository } from 'src/features/blogs/infrastructure/blogs.query-repository';

export class CreateBlogCommand {
  constructor(public createBlogDto: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(
    @Inject() protected blogsRepository: BlogsRepository,
    @Inject() protected postsService: PostsService,
    @Inject() protected blogsQueryRepository: BlogsQueryRepository,
    @Inject() protected postsQueryRepository: PostsQueryRepository,
  ) {}

  async execute(command: CreateBlogCommand) {
    const { createBlogDto } = command;
    const newBlog: Blog = {
      id: generateUuidV4(),
      createdAt: new Date().toISOString(),
      isMembership: false,
      websiteUrl: createBlogDto.websiteUrl,
      name: createBlogDto.name,
      description: createBlogDto.description,
    };

    return await this.blogsRepository.createBlog(newBlog);
  }
}
