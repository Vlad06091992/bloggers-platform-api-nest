import { Controller, Get, Res } from '@nestjs/common';
import { getIdFromParams } from 'src/infrastructure/decorators/getIdFromParams';
import { Response } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { FindBlogCommand } from 'src/features/sa_blogs/application/use-cases/find-blog';
import { FindPostsForSpecificBlogCommand } from 'src/features/sa_blogs/application/use-cases/find-posts-for-specific-blog';
import { FindBlogsCommand } from 'src/features/sa_blogs/application/use-cases/find-blogs';
import { CheckUserByJWTAccessToken } from 'src/infrastructure/decorators/checkUserByJWTAccessToken';
import {
  RequiredParamsValuesForBlogs,
  RequiredParamsValuesForPostsOrComments,
} from 'src/shared/common-types';
import { getValidQueryParamsForBlogs } from 'src/infrastructure/decorators/getValidQueryParamsForBlogs';
import { getValidQueryParamsForPosts } from 'src/infrastructure/decorators/getValidQueryParamsForPosts';

@Controller('/blogs')
export class BlogsController {
  constructor(private commandBus: CommandBus) {}
  @Get()
  findAll(@getValidQueryParamsForBlogs() params: RequiredParamsValuesForBlogs) {
    return this.commandBus.execute(new FindBlogsCommand(params));
  }

  @Get(':id')
  async findOne(
    @getIdFromParams() id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const blog = await this.commandBus.execute(new FindBlogCommand(id));
    if (blog) {
      return blog;
    } else {
      res.sendStatus(404);
    }
  }
  @Get(':id/posts')
  async findPostsForSpecificBlog(
    @CheckUserByJWTAccessToken() userId: string | null,
    @getValidQueryParamsForPosts()
    params: RequiredParamsValuesForPostsOrComments,
    @getIdFromParams() id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const blog = await this.commandBus.execute(new FindBlogCommand(id));

    if (!blog) {
      res.sendStatus(404);
      return;
    }

    return await this.commandBus.execute(
      new FindPostsForSpecificBlogCommand(id, userId, params),
    );
  }
}
