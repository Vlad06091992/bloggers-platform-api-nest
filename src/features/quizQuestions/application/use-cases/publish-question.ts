import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestionRepository } from 'src/features/quizQuestions/infrastructure/quiz-question-repository';
import { QuizQuestionsEntity } from 'src/features/quizQuestions/entity/quiz-questions.entity';
import { generateUuidV4 } from 'src/utils';
import { CreateOrUpdateQuestionDto } from 'src/features/quizQuestions/api/models/create-or-update-question-dto';

export class PublishQuestionComamnd {
  constructor(public id: string) {}
}

@CommandHandler(PublishQuestionComamnd)
export class PublishQuestionHandler
  implements ICommandHandler<PublishQuestionComamnd>
{
  constructor(protected quizQuestionRepository: QuizQuestionRepository) {}

  async execute(command: PublishQuestionComamnd) {
    const { id } = command;
    return await this.quizQuestionRepository.publishQuestion(id);
  }
}
