import { Controller, Get, NotFoundException, Query, Res } from '@nestjs/common';
import { isValidIdParam } from 'src/infrastructure/decorators/isValidIdParam';
import { CommentsService } from 'src/features/comments/application/comments.service';
import { Response } from 'express';

// import { UpdateUserDto } from 'src/features/users/api/models/update-user.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // @Get(':id')
  // async findOne(@isValidIdParam() id: string) {
  //   const user = await this.commentsService.findOne(id);
  //   if (user) {
  //     return user;
  //   } else {
  //     throw new NotFoundException([]);
  //   }
  // }

  @Get(':id')
  async findOne(
    @isValidIdParam() id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.commentsService.findOne(id);
    if (user) {
      return user;
    } else {
      return res.sendStatus(404);
    }
  }
}

// db.getCollection("comments").insertOne({
//   "id": "6686bf0fa0a8ab32d2219055",
//   "content": "comment",
//   "commentatorInfo": {
//     "userId": "vlad",
//     "userLogin": "smirnov.ru92@mail.ru"
//   },
//   "createdAt": "2024-07-05T08:56:17.899Z",
//   "likesInfo": {
//     "likesCount": 0,
//     "dislikesCount": 0,
//     "myStatus": "None"
//   }
// })
