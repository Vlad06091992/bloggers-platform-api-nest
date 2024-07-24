import { Inject } from "@nestjs/common";
import { PostsQueryRepository } from "src/features/posts/infrastructure/posts.query-repository";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QueryParams } from "src/shared/common-types";

export class FindPostsForSpecificBlogCommand {
  constructor(
    public blogId: string,
    public params: QueryParams,
  ) {}
}

@CommandHandler(FindPostsForSpecificBlogCommand)
export class FindBlogsForSpecificBlogHandler
  implements ICommandHandler<FindPostsForSpecificBlogCommand>
{
  constructor(@Inject() protected postsQueryRepository: PostsQueryRepository) {}

  async execute({ blogId, params }: FindPostsForSpecificBlogCommand) {
    return await this.postsQueryRepository.findPostsForSpecificBlog(
      params,
      blogId,
    );
  }
}
