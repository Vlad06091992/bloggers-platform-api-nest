import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostDtoWithoutBlogId } from 'src/features/posts/api/models/create-post.dto';
import { PostsService } from 'src/features/posts/application/posts.service';

export class CreatePostsForSpecificBlogCommand {
  constructor(
    public createPostDto: CreatePostDtoWithoutBlogId,
    public blogId: string,
  ) {}
}

@CommandHandler(CreatePostsForSpecificBlogCommand)
export class CreatePostForSpecificBlogHandler
  implements ICommandHandler<CreatePostsForSpecificBlogCommand>
{
  constructor(@Inject() protected postsService: PostsService) {}

  async execute({ createPostDto, blogId }: CreatePostsForSpecificBlogCommand) {
    return await this.postsService.create({ ...createPostDto, blogId });
  }
}
