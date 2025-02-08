import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestionRepository } from 'src/features/quizQuestions/infrastructure/quiz-question-repository';
import { QuizQuestionsEntity } from 'src/features/quizQuestions/entity/quiz-questions.entity';
import { generateUuidV4 } from 'src/utils';
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
