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

@Controller('/pair-game-quiz/pairs')
export class QuizController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly quizRepository: QuizRepository,
  ) {}
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('/my-current')
  async myCurrentGame(
    @getUserAfterJwtAuthGuard() user: { userId: string; userLogin: string },
  ) {
    /*возвращает активную игру текущего пользователя (того, кто делает запрос)
      в статусе "PendingSecondPlayer" или "Active".

      {
  "id": "string",
  "firstPlayerProgress": {
    "answers": [
      {
        "questionId": "string",
        "answerStatus": "Correct",
        "addedAt": "2025-02-09T07:53:46.044Z"
      }
    ],
    "player": {
      "id": "string",
      "login": "string"
    },
    "score": 0
  },
  "secondPlayerProgress": {
    "answers": [
      {
        "questionId": "string",
        "answerStatus": "Correct",
        "addedAt": "2025-02-09T07:53:46.044Z"
      }
    ],
    "player": {
      "id": "string",
      "login": "string"
    },
    "score": 0
  },
  "questions": [
    {
      "id": "string",
      "body": "string"
    }
  ],
  "status": "PendingSecondPlayer",
  "pairCreatedDate": "2025-02-09T07:53:46.044Z",
  "startGameDate": "2025-02-09T07:53:46.044Z",
  "finishGameDate": "2025-02-09T07:53:46.044Z"
}
      */

    const player = await this.quizRepository.findPlayerByUserId(user.userId);
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
  @Get('/:id')
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
  @Post('/connection')
  async connection(
    @getUserAfterJwtAuthGuard() user: { userId: string; userLogin: string },
  ) {
    return await this.commandBus.execute(
      new ConnectionCommand(user.userId, user.userLogin),
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('/my-current/answers')
  async answers(
    @getUserAfterJwtAuthGuard() user: { userId: string; userLogin: string },
    @Body() { answer }: { answer: string },
  ) {
    return await this.commandBus.execute(
      new AnswerCommand(user.userId, answer),
    );
  }
}
