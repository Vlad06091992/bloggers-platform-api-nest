import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestionRepository } from 'src/features/quizQuestions/infrastructure/quiz-question-repository';
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
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: count,
      items,
    };
  }
}
