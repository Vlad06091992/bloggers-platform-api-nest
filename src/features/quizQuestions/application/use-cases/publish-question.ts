import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestionRepository } from 'src/features/quizQuestions/infrastructure/quiz-question-repository';

export class PublishQuestionComamnd {
  constructor(
    public id: string,
    public publish: boolean,
  ) {}
}

@CommandHandler(PublishQuestionComamnd)
export class PublishQuestionHandler
  implements ICommandHandler<PublishQuestionComamnd>
{
  constructor(protected quizQuestionRepository: QuizQuestionRepository) {}

  async execute(command: PublishQuestionComamnd) {
    const { id, publish } = command;
    return await this.quizQuestionRepository.publishQuestion(id, publish);
  }
}
