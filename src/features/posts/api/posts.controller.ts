import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  Put,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { getIdFromParams } from 'src/infrastructure/decorators/getIdFromParams';
import { Response } from 'express';
import { PostsService } from 'src/features/posts/application/posts.service';
import { CreatePostDto } from 'src/features/posts/api/models/create-post.dto';
import { UpdatePostDto } from 'src/features/posts/api/models/update-post.dto';
import { JwtAuthGuard } from 'src/features/auth/guards/jwt-auth.guard';
import { BasicAuthGuard } from 'src/features/auth/guards/basic-auth.guard';
import { CommentDto } from 'src/features/comments/api/models/comment-dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCommentForPostCommand } from 'src/features/comments/application/use-cases/create-comment-for-post';
import { LikeStatusDto } from 'src/features/likes/api/models/like-status-dto';
import { UpdateLikeStatusCommand } from 'src/features/likes/application/use-cases/update-like-status';
import { CheckUserByJWTAccessToken } from 'src/infrastructure/decorators/checkUserByJWTAccessToken';
import { RequiredParamsValuesForPosts } from 'src/shared/common-types';
import { getValidQueryParamsForPosts } from 'src/infrastructure/decorators/getValidQueryParamsForPosts';

@Controller('/posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commandBus: CommandBus,
  ) {}
  @UseGuards(BasicAuthGuard)
  @Post()

  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(
    @CheckUserByJWTAccessToken() userId: string | null,
    @getValidQueryParamsForPosts() params: RequiredParamsValuesForPosts,
  ) {
    return this.postsService.findAll(params, userId);
  }

  @Get(':id/comments')
  async findComments(
    @CheckUserByJWTAccessToken() userId: string | null,
    @getIdFromParams() id: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
  ) {
    const queryParams = {
      sortDirection,
      pageNumber,
      pageSize,
      sortBy,
    };

    const post = await this.postsService.findOne(id, userId);
    if (!post) {
      throw new NotFoundException();
    }

    return this.postsService.getCommentsForPost(id, queryParams, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async createCommentForPost(
    @Request() req,
    @getIdFromParams() id: string,
    @Body() { content }: CommentDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const post = await this.postsService.findOne(id, null);

    if (!post) {
      res.sendStatus(404);
      return;
    }

    const { userId, userLogin } = req.user;
    const comment = await this.commandBus.execute(
      new CreateCommentForPostCommand({
        postId: id,
        userLogin,
        userId,
        content,
      }),
    );

    return comment;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(':id/like-status')
  async updatePostLikeStatus(
    @getIdFromParams() id: string,
    @Body() { likeStatus }: LikeStatusDto,
    @Request() req,
  ) {
    const { userId, userLogin } = req.user;
    const post = await this.postsService.findOne(id, userId);
    if (!post) {
      throw new NotFoundException();
    } else {
      const likedEntity = 'post';

      await this.commandBus.execute(
        new UpdateLikeStatusCommand(
          likeStatus,
          id,
          userId,
          userLogin,
          likedEntity,
        ),
      );
    }
  }

  @Get(':id')
  async findOne(
    @getIdFromParams() id: string,
    @CheckUserByJWTAccessToken() userId: string | null,
    @Res({ passthrough: true }) res: Response,
  ) {
    const post = await this.postsService.findOne(id, userId);
    if (post) {
      return post;
    } else {
      res.sendStatus(404);
      return;
    }
  }
  @UseGuards(BasicAuthGuard)
  @Put(':id')
  async updateOne(
    @getIdFromParams() id: string,
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
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  async remove(@getIdFromParams() id: string, @Res() res: Response) {
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
