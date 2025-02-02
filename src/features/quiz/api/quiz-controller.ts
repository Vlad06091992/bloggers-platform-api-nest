import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GetUserByAccessToken } from 'src/infrastructure/decorators/getUserByAccessToken';
import { CheckUserByJWTAccessToken } from 'src/infrastructure/decorators/checkUserByJWTAccessToken';
import { JwtAuthGuard } from 'src/features/auth/guards/jwt-auth.guard';
import { getUserAfterJwtAuthGuard } from 'src/infrastructure/decorators/getUserAfterJwtAuthGuard';

@Controller('/pair-game-quiz/pairs')
export class QuizController {
  constructor(private readonly commandBus: CommandBus) {}
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('/my-current')
  async myCurrentGame(
    @getUserAfterJwtAuthGuard() user: { userId: string; userLogin: string },
  ) {
    debugger;
    return { user };

    // return await this.commandBus.execute(
    //   new GetUserDevicesByUserIdCommand(refreshToken),
    // );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('/:id')
  async getGameById(
    @getUserAfterJwtAuthGuard() user: { userId: string; userLogin: string },
    @Param('id') id: string,
  ) {
    return { user, id };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('/connection')
  async connection(
    @getUserAfterJwtAuthGuard() user: { userId: string; userLogin: string },
    @Param('id') id: string,
  ) {
    return { user, id, connection: true };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('/my-current/answers')
  async answers(
    @getUserAfterJwtAuthGuard() user: { userId: string; userLogin: string },
    @Body() { answer }: { answer: string },
  ) {
    return { user, answer };
  }
}
