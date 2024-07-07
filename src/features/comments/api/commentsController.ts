import { Controller, Get, Res } from '@nestjs/common';
import { isValidIdParam } from 'src/infrastructure/decorators/isValidIdParam';
import { CommentsService } from 'src/features/comments/application/comments.service';
import { Response } from 'express';

@Controller('blogs')
export class CommentsController {
  constructor(private readonly blogsService: CommentsService) {}

  @Get(':id')
  async findOne(
    @isValidIdParam() id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.blogsService.findOne(id);
    if (user) {
      return user;
    } else {
      return res.sendStatus(404);
    }
  }
}
