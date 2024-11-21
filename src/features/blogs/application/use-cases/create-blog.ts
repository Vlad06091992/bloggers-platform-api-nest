import { Inject } from '@nestjs/common';
import { BlogsRepository } from 'src/features/blogs/infrastructure/blogs-repository';
import { CreateBlogDto } from 'src/features/blogs/api/models/create-blog.dto';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { PostsService } from 'src/features/posts/application/posts.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { generateUuidV4 } from 'src/utils';
import { BlogsQueryRepository } from 'src/features/blogs/infrastructure/blogs.query-repository';
import { BlogsEntity } from 'src/features/blogs/entity/blogs.entity';

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
    const {
      createBlogDto: { name, websiteUrl, description },
    } = command;
    const newBlog = new BlogsEntity(
      generateUuidV4(),
      new Date(),
      false,
      websiteUrl,
      name,
      description,
    );
    return await this.blogsRepository.createBlog(newBlog);
  }
}
