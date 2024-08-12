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
import { IsValidIdParam } from 'src/infrastructure/decorators/isValidIdParam';
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
import { CheckUserByJWT } from 'src/infrastructure/decorators/checkUserByJWT';

@Controller('posts')
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
    @CheckUserByJWT() userId: string | null,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
  ) {
    const QueryParams = {
      sortDirection,
      pageNumber,
      pageSize,
      sortBy,
    };

    return this.postsService.findAll(QueryParams, userId);
  }

  @Get(':id/comments')
  async findComments(
    @CheckUserByJWT() userId: string | null,
    @IsValidIdParam() id: string,
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
    @IsValidIdParam() id: string,
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
    @IsValidIdParam() id: string,
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
    @IsValidIdParam() id: string,
    @CheckUserByJWT() userId: string | null,
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
    @IsValidIdParam() id: string,
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
  async remove(@IsValidIdParam() id: string, @Res() res: Response) {
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
