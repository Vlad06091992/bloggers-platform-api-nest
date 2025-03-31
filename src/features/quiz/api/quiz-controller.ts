import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/features/auth/guards/jwt-auth.guard';
import { getUserAfterJwtAuthGuard } from 'src/infrastructure/decorators/getUserAfterJwtAuthGuard';
import { ConnectionCommand } from 'src/features/quiz/application/use-cases/connection';
import { AnswerCommand } from 'src/features/quiz/application/use-cases/answer';
import { GetGameExtendedInfoCommand } from 'src/features/quiz/application/use-cases/get-game-extended-info';
import { QuizRepository } from 'src/features/quiz/infrastructure/quiz-repository';
import { GetIdFromParams } from 'src/infrastructure/decorators/getIdFromParams';
import { RequiredParamsValuesForMyGames } from 'src/shared/common-types';
import { getValidQueryParamsForMyGames } from 'src/infrastructure/decorators/getValidQueryParamsForMyGames';
import { GetMyGamesExtendedInfoCommand } from 'src/features/quiz/application/use-cases/get-my-games';
import { StatisticCommand } from 'src/features/quiz/application/use-cases/statistics';

@Controller('/pair-game-quiz')
export class QuizController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly quizRepository: QuizRepository,
  ) {}
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('/pairs/my-current')
  async myCurrentGame(
    @getUserAfterJwtAuthGuard() user: { userId: string; userLogin: string },
  ) {
    const player = await this.quizRepository.findLastPlayerByUserId(
      user.userId,
    );
    const game = await this.quizRepository.findGameByPlayerId(player?.id);

    if (!game || game.status === 'Finished') {
      throw new NotFoundException();
    }

    return await this.commandBus.execute(
      new GetGameExtendedInfoCommand(game?.id, user.userId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('/pairs/my')
  async myGames(
    @getValidQueryParamsForMyGames() params: RequiredParamsValuesForMyGames,
    @getUserAfterJwtAuthGuard() user: { userId: string; userLogin: string },
  ) {
    return await this.commandBus.execute(
      new GetMyGamesExtendedInfoCommand(user.userId, user.userLogin, params),
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('/users/my-statistic')
  async myStatistics(
    @getUserAfterJwtAuthGuard() user: { userId: string; userLogin: string },
  ) {
    /*
    - sumScore: общая сумма набранных очков игроком или командой. Это может быть сумма всех очков, набранных за определенный период времени или за все игры, в которых они участвовали.

    - avgScores: среднее количество очков, набранных за игру. Это значение может быть рассчитано как отношение sumScore к gamesCount, то есть общая сумма очков делится на количество игр.

    - gamesCount: количество игр, в которых игрок или команда приняли участие.

    - winsCount: количество побед, одержанных игроком или командой.

    - lossesCount: количество поражений, которые потерпел игрок или команда.

    - drawsCount: количество игр, которые закончились вничью для игрока или команды.
  */

    console.log(user.userId);

    return await this.commandBus.execute(new StatisticCommand(user.userId));

    return {
      sumScore: 0,
      avgScores: 0,
      gamesCount: 0,
      winsCount: 0,
      lossesCount: 0,
      drawsCount: 0,
    };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('/pairs/:id')
  async getGameById(
    @getUserAfterJwtAuthGuard() user: { userId: string; userLogin: string },
    @GetIdFromParams() id: string,
  ) {
    return await this.commandBus.execute(
      new GetGameExtendedInfoCommand(id, user.userId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('/pairs/connection')
  async connection(
    @getUserAfterJwtAuthGuard() user: { userId: string; userLogin: string },
  ) {
    return await this.commandBus.execute(
      new ConnectionCommand(user.userId, user.userLogin),
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('/pairs/my-current/answers')
  async answers(
    @getUserAfterJwtAuthGuard() user: { userId: string; userLogin: string },
    @Body() { answer }: { answer: string },
  ) {
    return await this.commandBus.execute(
      new AnswerCommand(user.userId, answer),
    );
  }
}
