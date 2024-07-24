import { Inject } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { BlogsRepository } from 'src/features/blogs/infrastructure/blogs-repository';
import { BlogsQueryRepository } from 'src/features/blogs/infrastructure/blogs.query-repository';
import { CreateBlogDto } from 'src/features/blogs/api/models/create-blog.dto';
import { Blog } from 'src/features/blogs/domain/blogs-schema';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { PostsService } from 'src/features/posts/application/posts.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class FindBlogCommand {
  constructor(public blogId: string) {}
}

@CommandHandler(FindBlogCommand)
export class FindBlogHandler implements ICommandHandler<FindBlogCommand> {
  constructor(@Inject() protected blogsQueryRepository: BlogsQueryRepository) {}

  async execute({ blogId }: FindBlogCommand) {
    return await this.blogsQueryRepository.getBlogById(blogId, true);
  }
}
