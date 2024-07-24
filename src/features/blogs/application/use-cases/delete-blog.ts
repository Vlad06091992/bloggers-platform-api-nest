import { Inject } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { BlogsRepository } from 'src/features/blogs/infrastructure/blogs-repository';
import { BlogsQueryRepository } from 'src/features/blogs/infrastructure/blogs.query-repository';
import { CreateBlogDto } from 'src/features/blogs/api/models/create-blog.dto';
import { Blog } from 'src/features/blogs/domain/blogs-schema';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { PostsService } from 'src/features/posts/application/posts.service';
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
