import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Put,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { getIdFromParams } from 'src/infrastructure/decorators/getIdFromParams';
import { Response } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { FindCommentByIdCommand } from 'src/features/comments/application/use-cases/find-comment-by-id';
import { DeleteCommentByIdCommand } from 'src/features/comments/application/use-cases/delete-comment-by-id';
import { CommentDto } from 'src/features/comments/api/models/comment-dto';
import { UpdateCommentByIdCommand } from 'src/features/comments/application/use-cases/update-comment-by-id';
import { JwtAuthGuard } from 'src/features/auth/guards/jwt-auth.guard';
import { UpdateLikeStatusCommand } from 'src/features/likes/application/use-cases/update-like-status';
import { LikeStatusDto } from 'src/features/likes/api/models/like-status-dto';
import { CheckUserByJWTAccessToken } from 'src/infrastructure/decorators/checkUserByJWTAccessToken';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get(':id')
  async findOne(
    @getIdFromParams() id: string,
    @CheckUserByJWTAccessToken() userId: string | null,
    @Res({ passthrough: true }) res: Response,
  ) {
    const comment = await this.commandBus.execute(
      new FindCommentByIdCommand(id, userId),
    );
    if (comment) {
      return comment;
    } else {
      res.sendStatus(404);
      return;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateOne(
    @Request() req,
    @getIdFromParams() id: string,
    @Body() { content }: CommentDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const comment = await this.commandBus.execute(
      new FindCommentByIdCommand(id, null),
    );

    if (!comment) {
      res.sendStatus(404);
      return;
    }

    const { userId } = req.user;

    if (comment.commentatorInfo.userId !== userId) {
      return res.sendStatus(403);
    }

    const isUpdated = await this.commandBus.execute(
      new UpdateCommentByIdCommand(id, content),
    );
    if (isUpdated) {
      return res.sendStatus(204);
    } else {
      return res.sendStatus(404);
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(':id/like-status')
  async updateCommentLikeStatus(
    @getIdFromParams() id: string,
    @Body() { likeStatus }: LikeStatusDto,
    @Request() req,
  ) {
    const { userId, userLogin } = req.user;
    const comment = await this.commandBus.execute(
      new FindCommentByIdCommand(id, userId),
    );

    if (!comment) {
      throw new NotFoundException();
    } else {
      const likedEntity = 'comment';

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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteOne(
    @getIdFromParams() id: string,
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { userId } = req.user;

    const comment = await this.commandBus.execute(
      new FindCommentByIdCommand(id, userId),
    );

    if (!comment) {
      res.sendStatus(404);
      return;
    }

    if (comment.commentatorInfo.userId !== userId) {
      res.sendStatus(403);
      return;
    }

    const isDeleted = await this.commandBus.execute(
      new DeleteCommentByIdCommand(id),
    );

    if (!isDeleted) {
      throw new NotFoundException();
    }
  }
}
