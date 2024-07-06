import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { isValidIdParam } from 'src/infrastructure/decorators/isValidIdParam';
import { Response } from 'express';
import { PostsService } from 'src/features/posts/application/posts.service';
import { CreatePostDto } from 'src/features/posts/api/models/create-post.dto';
import { UpdatePostDto } from 'src/features/posts/api/models/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('searchLoginTerm') searchLoginTerm: string,
    @Query('searchEmailTerm') searchEmailTerm: string,
  ) {
    const QueryParams = {
      sortDirection,
      searchEmailTerm,
      searchLoginTerm,
      pageNumber,
      pageSize,
      sortBy,
    };

    return this.postsService.findAll(QueryParams);
  }

  @Get(':id')
  async findOne(
    @isValidIdParam() id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.postsService.findOne(id);
    if (user) {
      return user;
    } else {
      res.sendStatus(404);
    }
  }

  @Put(':id')
  async updateOne(
    @isValidIdParam() id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Res() res: Response,
  ) {
    const isUpdated = await this.postsService.updateOne(id, updatePostDto);
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

    const isDeleted = await this.postsService.remove(id);

    if (!isDeleted) {
      res.sendStatus(404);
    }

    if (isDeleted) {
      res.sendStatus(204);
      return;
    }
  }
}
