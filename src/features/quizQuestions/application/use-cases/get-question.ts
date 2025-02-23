import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestionRepository } from 'src/features/quizQuestions/infrastructure/quiz-question-repository';
import { QuizQuestionsEntity } from 'src/features/quizQuestions/entity/quiz-questions.entity';
import { generateUuidV4 } from 'src/utils';
import { CreateOrUpdateQuestionDto } from 'src/features/quizQuestions/api/models/create-or-update-question-dto';
import { RequiredParamsValuesForQuizQuestions } from 'src/shared/common-types';

export class GetQuestionComamnd {
  constructor(
    public requiredParamsValuesForQuizQuestions: RequiredParamsValuesForQuizQuestions,
  ) {}
}

@CommandHandler(GetQuestionComamnd)
export class GetQuestionHandler implements ICommandHandler<GetQuestionComamnd> {
  constructor(protected quizQuestionRepository: QuizQuestionRepository) {}

  async execute(command: GetQuestionComamnd) {
    const {
      requiredParamsValuesForQuizQuestions: {
        pageNumber,
        pageSize,
        bodySearchTerm,
        sortDirection,
        sortBy,
        publishedStatus,
      },
    } = command;

    const { items, count } = await this.quizQuestionRepository.getQuestions({
      pageNumber,
      pageSize,
      bodySearchTerm,
      sortDirection,
      sortBy,
      publishedStatus,
    });

    return {
      pagesCount: Math.ceil(count / +pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: count,
      items,
    };
  }
}
