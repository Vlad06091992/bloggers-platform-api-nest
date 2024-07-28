import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { IsValidIdParam } from 'src/infrastructure/decorators/isValidIdParam';
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

@Controller('blogs')
export class BlogsController {
  constructor(private commandBus: CommandBus) {}
  @UseGuards(BasicAuthGuard)
  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.commandBus.execute(new CreateBlogCommand(createBlogDto));
  }

  @Get()
  findAll(
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('searchNameTerm') searchNameTerm: string,
  ) {
    const QueryParams = {
      sortDirection,
      searchNameTerm,
      pageNumber,
      pageSize,
      sortBy,
    };

    return this.commandBus.execute(new FindBlogsCommand(QueryParams));
  }

  @Get(':id')
  async findOne(
    @IsValidIdParam() id: string,
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
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('searchNameTerm') searchNameTerm: string,
    @IsValidIdParam() id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const queryParams = {
      sortDirection,
      searchNameTerm,
      pageNumber,
      pageSize,
      sortBy,
    };

    const blog = await this.commandBus.execute(new FindBlogCommand(id));

    if (!blog) {
      res.sendStatus(404);
      return;
    }

    return await this.commandBus.execute(
      new FindPostsForSpecificBlogCommand(id, queryParams),
    );
  }

  @Post(':id/posts')
  async createPostForSpecificBlog(
    @Body() createPostDto: CreatePostDtoWithoutBlogId,
    @IsValidIdParam() id: string,
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
  @Put(':id')
  async updateOne(
    @IsValidIdParam() id: string,
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
  async remove(@IsValidIdParam() id: string, @Res() res: Response) {
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
