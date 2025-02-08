import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Put,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GetIdFromParams } from 'src/infrastructure/decorators/getIdFromParams';
import { Response } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { FindCommentByIdCommand } from 'src/features/comments/application/use-cases/find-comment-by-id';
import { DeleteCommentByIdCommand } from 'src/features/comments/application/use-cases/delete-comment-by-id';
import { CommentDto } from 'src/features/comments/api/models/comment-dto';
import { UpdateCommentByIdCommand } from 'src/features/comments/application/use-cases/update-comment-by-id';
import { JwtAuthGuard } from 'src/features/auth/guards/jwt-auth.guard';
import { UpdateOrCreateLikeCommentStatusCommand } from 'src/features/comments-reactions/application/use-cases/update-or-create-comment-like-status';
import { LikeStatusDto } from 'src/features/comments-reactions/api/models/like-status-dto';
import { CheckUserByJWTAccessToken } from 'src/infrastructure/decorators/checkUserByJWTAccessToken';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get(':id')
  async findOne(
    @GetIdFromParams() id: string,
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
  @HttpCode(204)
  @Put(':id')
  async updateOne(
    @Request() req,
    @GetIdFromParams() id: string,
    @Body() { content }: CommentDto,
  ) {
    const comment = await this.commandBus.execute(
      new FindCommentByIdCommand(id, null),
    );

    if (!comment) {
      throw new NotFoundException();
    }

    const { userId } = req.user;

    if (comment.commentatorInfo.userId !== userId) {
      throw new ForbiddenException();
    }

    const isUpdated = await this.commandBus.execute(
      new UpdateCommentByIdCommand(id, content),
    );
    if (isUpdated) {
      return;
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(':id/like-status')
  async updateCommentLikeStatus(
    @GetIdFromParams() id: string,
    @Body() { likeStatus }: LikeStatusDto,
    @Request() req,
  ) {
    debugger;
    const { userId, userLogin } = req.user;
    const comment = await this.commandBus.execute(
      new FindCommentByIdCommand(id, userId),
    );

    if (!comment) {
      throw new NotFoundException();
    } else {
      const likedEntity = 'comment';

      await this.commandBus.execute(
        new UpdateOrCreateLikeCommentStatusCommand(
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
    @GetIdFromParams() id: string,
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
