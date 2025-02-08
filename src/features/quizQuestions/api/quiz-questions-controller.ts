import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BasicAuthGuard } from 'src/features/auth/guards/basic-auth.guard';
import { getValidQueryParamsForQuizQuestions } from 'src/infrastructure/decorators/getValidQueryParamsForQuizQuestions';
import { RequiredParamsValuesForQuizQuestions } from 'src/shared/common-types';
import { CreateOrUpdateQuestionDto } from 'src/features/quizQuestions/api/models/create-or-update-question-dto';
import { GetIdFromParams } from 'src/infrastructure/decorators/getIdFromParams';
import { CreateQuestionComamnd } from 'src/features/quizQuestions/application/use-cases/create-question';
import { DeleteQuestionComamnd } from 'src/features/quizQuestions/application/use-cases/delete-question';
import { UpdateQuestionComamnd } from 'src/features/quizQuestions/application/use-cases/update-question';
import { PublishQuestionComamnd } from 'src/features/quizQuestions/application/use-cases/publish-question';
import { GetQuestionComamnd } from 'src/features/quizQuestions/application/use-cases/get-question';

@Controller('/sa/quiz/questions')
export class QuizQuestionsController {
  constructor(private readonly commandBus: CommandBus) {}
  @UseGuards(BasicAuthGuard)
  @HttpCode(200)
  @Get('')
  async getQuestions(
    @getValidQueryParamsForQuizQuestions()
    params: RequiredParamsValuesForQuizQuestions,
  ) {
    return await this.commandBus.execute(new GetQuestionComamnd(params));
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(200)
  @Post('')
  async createQuestion(@Body() createQuestionDto: CreateOrUpdateQuestionDto) {
    return this.commandBus.execute(
      new CreateQuestionComamnd(createQuestionDto),
    );
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Delete('/:id')
  async deleteQuestion(@GetIdFromParams() id: string) {
    const result = await this.commandBus.execute(new DeleteQuestionComamnd(id));

    if (!result) {
      throw new NotFoundException();
    }
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Put('/:id')
  async updateQuestion(
    @GetIdFromParams() id: string,
    @Body() updateQuestionDto: CreateOrUpdateQuestionDto,
  ) {
    const result = await this.commandBus.execute(
      new UpdateQuestionComamnd(updateQuestionDto, id),
    );

    if (!result) {
      throw new NotFoundException();
    }
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Put('/:id/publish')
  async updateQuestionPublishStatus(@GetIdFromParams() id: string) {
    const result = await this.commandBus.execute(
      new PublishQuestionComamnd(id),
    );

    if (!result) {
      throw new NotFoundException();
    }
  }
}
