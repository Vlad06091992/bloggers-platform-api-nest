import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from 'src/features/blogs/infrastructure/blogs.query-repository';

export class FindBlogCommand {
  constructor(public blogId: string) {}
}

@CommandHandler(FindBlogCommand)
export class FindBlogHandler implements ICommandHandler<FindBlogCommand> {
  constructor(@Inject() protected blogsQueryRepository: BlogsQueryRepository) {}

  async execute({ blogId }: FindBlogCommand) {
    return await this.blogsQueryRepository.getBlogById(blogId);
  }
}
