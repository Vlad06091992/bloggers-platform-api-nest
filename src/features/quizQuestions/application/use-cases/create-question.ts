import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestionRepository } from 'src/features/quizQuestions/infrastructure/quiz-question-repository';
import { QuizQuestionsEntity } from 'src/features/quizQuestions/entity/quiz-questions.entity';
import { generateUuidV4 } from 'src/utils';
import { CreateOrUpdateQuestionDto } from 'src/features/quizQuestions/api/models/create-or-update-question-dto';

export class CreateQuestionComamnd {
  constructor(public createOrUpdateQuestionDto: CreateOrUpdateQuestionDto) {}
}

@CommandHandler(CreateQuestionComamnd)
export class CreateQuestionHandler
  implements ICommandHandler<CreateQuestionComamnd>
{
  constructor(protected quizQuestionRepository: QuizQuestionRepository) {}

  async execute(command: CreateQuestionComamnd) {
    const {
      createOrUpdateQuestionDto: { correctAnswers, body },
    } = command;

    const question = new QuizQuestionsEntity(
      generateUuidV4(),
      body,
      correctAnswers,
      new Date(),
      null,
    );

    await this.quizQuestionRepository.createQuestion(question);
    return question;
  }
}
