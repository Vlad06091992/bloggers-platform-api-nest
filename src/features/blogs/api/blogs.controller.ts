import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { isValidIdParam } from 'src/infrastructure/decorators/isValidIdParam';
import { Response } from 'express';
import { UpdateBlogDto } from 'src/features/blogs/api/models/update-blog.dto';
import { CreateBlogDto } from 'src/features/blogs/api/models/create-blog.dto';
import { BlogsService } from 'src/features/blogs/application/blogs.service';
import { CreatePostDtoWithoutBlogId } from 'src/features/posts/api/models/create-post.dto';
import { Request } from 'express';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
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

    return this.blogsService.findAll(QueryParams);
  }

  @Get(':id')
  async findOne(
    @isValidIdParam() id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const blog = await this.blogsService.findOne(id);
    if (blog) {
      return blog;
    } else {
      res.sendStatus(404);
    }
  }

  @Get(':id/posts')
  async findPostsForSpecificBlog(
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('searchNameTerm') searchNameTerm: string,
    @isValidIdParam() id: string,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const queryParams = {
      sortDirection,
      searchNameTerm,
      pageNumber,
      pageSize,
      sortBy,
    };

    const blog = await this.blogsService.findOne(id);

    if (!blog) {
      res.sendStatus(404);
      return;
    }

    return await this.blogsService.findPostsForSpecificBlog(queryParams, id);
  }

  @Post(':id/posts')
  async createPostForSpecificBlog(
    @Body() createPostDto: CreatePostDtoWithoutBlogId,
    @isValidIdParam() id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const blog = await this.blogsService.findOne(id);

    if (!blog) {
      res.sendStatus(404);
      return;
    }

    return await this.blogsService.createPostsForSpecificBlog(
      createPostDto,
      id,
    );
  }

  @Put(':id')
  async updateOne(
    @isValidIdParam() id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @Res() res: Response,
  ) {
    const isUpdated = await this.blogsService.updateOne(id, updateBlogDto);
    if (isUpdated) {
      return res.sendStatus(204);
    } else {
      return res.sendStatus(404);
    }
  }

  @Delete(':id')
  async remove(@isValidIdParam() id: string, @Res() res: Response) {
    if (!id) {
      res.sendStatus(404);
      return;
    }

    const isDeleted = await this.blogsService.remove(id);

    if (!isDeleted) {
      res.sendStatus(404);
    }

    if (isDeleted) {
      res.sendStatus(204);
      return;
    }
  }
}
