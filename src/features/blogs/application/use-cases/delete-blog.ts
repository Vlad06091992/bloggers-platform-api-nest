import { Inject } from '@nestjs/common';
import { BlogsRepository } from 'src/features/blogs/infrastructure/blogs-repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeleteBlogCommand {
  constructor(public blogId: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogHandler implements ICommandHandler<DeleteBlogCommand> {
  constructor(@Inject() protected blogsRepository: BlogsRepository) {}

  async execute({ blogId }: DeleteBlogCommand) {
    return this.blogsRepository.removeBlogById(blogId);
  }
}
