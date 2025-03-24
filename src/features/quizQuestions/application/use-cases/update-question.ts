import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestionRepository } from 'src/features/quizQuestions/infrastructure/quiz-question-repository';
import { CreateOrUpdateQuestionDto } from 'src/features/quizQuestions/api/models/create-or-update-question-dto';

export class UpdateQuestionComamnd {
  constructor(
    public createOrUpdateQuestionDto: CreateOrUpdateQuestionDto,
    public id: string,
  ) {}
}

@CommandHandler(UpdateQuestionComamnd)
export class UpdateQuestionHandler
  implements ICommandHandler<UpdateQuestionComamnd>
{
  constructor(protected quizQuestionRepository: QuizQuestionRepository) {}

  async execute(command: UpdateQuestionComamnd) {
    const {
      createOrUpdateQuestionDto: { correctAnswers, body },
      id,
    } = command;
    return await this.quizQuestionRepository.updateQuestion(id, {
      correctAnswers,
      body,
    });
  }
}
