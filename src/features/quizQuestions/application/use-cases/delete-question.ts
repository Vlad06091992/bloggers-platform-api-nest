import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestionRepository } from 'src/features/quizQuestions/infrastructure/quiz-question-repository';

export class DeleteQuestionComamnd {
  constructor(public id: string) {}
}

@CommandHandler(DeleteQuestionComamnd)
export class DeleteQuestionHandler
  implements ICommandHandler<DeleteQuestionComamnd>
{
  constructor(protected quizQuestionRepository: QuizQuestionRepository) {}

  async execute(command: DeleteQuestionComamnd) {
    const { id } = command;

    return await this.quizQuestionRepository.deleteQuestionById(id);
  }
}
