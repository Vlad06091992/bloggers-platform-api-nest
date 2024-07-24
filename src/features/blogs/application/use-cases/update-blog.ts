import { Inject } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { BlogsRepository } from 'src/features/blogs/infrastructure/blogs-repository';
import { BlogsQueryRepository } from 'src/features/blogs/infrastructure/blogs.query-repository';
import { CreateBlogDto } from 'src/features/blogs/api/models/create-blog.dto';
import { Blog } from 'src/features/blogs/domain/blogs-schema';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { PostsService } from 'src/features/posts/application/posts.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBlogDto } from 'src/features/blogs/api/models/update-blog.dto';

export class UpdateBlogCommand {
  constructor(
    public updateBlogDto: UpdateBlogDto,
    public id: string,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogHandler implements ICommandHandler<UpdateBlogCommand> {
  constructor(
    @Inject() protected blogsRepository: BlogsRepository,
    @Inject() protected postsService: PostsService,
    @Inject() protected blogsQueryRepository: BlogsQueryRepository,
    @Inject() protected postsQueryRepository: PostsQueryRepository,
  ) {}

  async execute({ updateBlogDto, id }: UpdateBlogCommand) {
    return await this.blogsRepository.updateBlog(id, updateBlogDto);
  }
}
