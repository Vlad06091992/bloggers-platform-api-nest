import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GetIdFromParams } from 'src/infrastructure/decorators/getIdFromParams';
import { Response } from 'express';
import { UpdateBlogDto } from 'src/features/blogs/api/models/update-blog.dto';
import { CreateBlogDto } from 'src/features/blogs/api/models/create-blog.dto';
import { CreatePostDtoWithoutBlogId } from 'src/features/posts/api/models/create-post.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from 'src/features/blogs/application/use-cases/create-blog';
import { DeleteBlogCommand } from 'src/features/blogs/application/use-cases/delete-blog';
import { UpdateBlogCommand } from 'src/features/blogs/application/use-cases/update-blog';
import { FindBlogCommand } from 'src/features/blogs/application/use-cases/find-blog';
import { FindPostsForSpecificBlogCommand } from 'src/features/blogs/application/use-cases/find-posts-for-specific-blog';
import { FindBlogsCommand } from 'src/features/blogs/application/use-cases/find-blogs';
import { CreatePostsForSpecificBlogCommand } from 'src/features/blogs/application/use-cases/create-post-for-specific-blog';
import { BasicAuthGuard } from 'src/features/auth/guards/basic-auth.guard';
import { CheckUserByJWTAccessToken } from 'src/infrastructure/decorators/checkUserByJWTAccessToken';
import {
  RequiredParamsValuesForBlogs,
  RequiredParamsValuesForPostsOrComments,
} from 'src/shared/common-types';
import { getValidQueryParamsForBlogs } from 'src/infrastructure/decorators/getValidQueryParamsForBlogs';
import { getValidQueryParamsForPosts } from 'src/infrastructure/decorators/getValidQueryParamsForPosts';
import { UpdatePostDto } from 'src/features/posts/api/models/update-post.dto';
import { PostsService } from 'src/features/posts/application/posts.service';

@Controller('/sa/blogs')
export class SaBlogsController {
  constructor(
    private commandBus: CommandBus,
    @Inject() protected postsService: PostsService,
  ) {} //TODO должны быть одинаковые инъекции
  @UseGuards(BasicAuthGuard)
  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.commandBus.execute(new CreateBlogCommand(createBlogDto));
  }

  @UseGuards(BasicAuthGuard)
  @Get()
  findAll(@getValidQueryParamsForBlogs() params: RequiredParamsValuesForBlogs) {
    return this.commandBus.execute(new FindBlogsCommand(params));
  }

  @UseGuards(BasicAuthGuard)
  @Get(':id')
  async findOne(
    @GetIdFromParams() id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const blog = await this.commandBus.execute(new FindBlogCommand(id));
    if (blog) {
      return blog;
    } else {
      res.sendStatus(404);
    }
  }

  @UseGuards(BasicAuthGuard)
  @Get(':id/posts')
  async findPostsForSpecificBlog(
    @CheckUserByJWTAccessToken() userId: string | null,
    @getValidQueryParamsForPosts()
    params: RequiredParamsValuesForPostsOrComments,
    @GetIdFromParams() id: string,
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

  @UseGuards(BasicAuthGuard)
  @Post(':id/posts')
  async updatePostForSpecificBlog(
    @Body() createPostDto: CreatePostDtoWithoutBlogId,
    @GetIdFromParams() id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const blog = await this.commandBus.execute(new FindBlogCommand(id));

    if (!blog) {
      res.sendStatus(404);
      return;
    }

    return await this.commandBus.execute(
      new CreatePostsForSpecificBlogCommand(createPostDto, id),
    );
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204) //TODO коды сложить куда то в одно место
  @Put(':blogId/posts/:postId')
  async createPostForSpecificBlog(
    @Body() updatePostDto: UpdatePostDto,
    @GetIdFromParams({ paramName: 'blogId' }) blogId: string,
    @GetIdFromParams({ paramName: 'postId' }) postId: string,
  ) {
    const blog = await this.commandBus.execute(new FindBlogCommand(blogId)); //TODO подобное унести в Pipe
    const post = await this.postsService.findOnePostByIdWithLikesAndReactions(
      postId,
      null,
    );

    if (!blog || !post) {
      throw new NotFoundException();
    }
    const isUpdated = await this.postsService.updateOne(postId, updatePostDto);
    if (!isUpdated) {
      throw new NotFoundException();
    }
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204) //TODO коды сложить куда то в одно место
  @Delete(':blogId/posts/:postId')
  async deletePostForSpecificBlog(
    @GetIdFromParams({ paramName: 'blogId' }) blogId: string,
    @GetIdFromParams({ paramName: 'postId' }) postId: string,
  ) {
    const blog = await this.commandBus.execute(new FindBlogCommand(blogId)); //TODO подобное унести в Pipe
    const post = this.postsService.findOnePostByIdWithLikesAndReactions(
      postId,
      null,
    );

    if (!blog || !post) {
      throw new NotFoundException();
    }
    const isUpdated = await this.postsService.remove(postId); //TODO нейминги методов у сервисов/репозиториев;
    if (!isUpdated) {
      throw new NotFoundException();
    }
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  async updateOne(
    @GetIdFromParams() id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @Res() res: Response,
  ) {
    const isUpdated = await this.commandBus.execute(
      new UpdateBlogCommand(updateBlogDto, id),
    );
    if (isUpdated) {
      return res.sendStatus(204);
    } else {
      return res.sendStatus(404);
    }
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  async remove(@GetIdFromParams() id: string, @Res() res: Response) {
    if (!id) {
      res.sendStatus(404);
      return;
    }

    const isDeleted = await this.commandBus.execute(new DeleteBlogCommand(id));

    if (!isDeleted) {
      res.sendStatus(404);
      return;
    }

    if (isDeleted) {
      res.sendStatus(204);
      return;
    }
  }
}
