import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { QuizQuestionsEntity } from 'src/features/quizQuestions/entity/quiz-questions.entity';
import { CreateOrUpdateQuestionDto } from 'src/features/quizQuestions/api/models/create-or-update-question-dto';
import { RequiredParamsValuesForQuizQuestions } from 'src/shared/common-types';

@Injectable()
export class QuizQuestionRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(QuizQuestionsEntity)
    protected quizQuestionRepo: Repository<QuizQuestionsEntity>,
  ) {}

  async getQuestions(
    requiredParamsValuesForQuizQuestions: RequiredParamsValuesForQuizQuestions,
  ) {
    const {
      pageNumber,
      pageSize,
      sortDirection,
      sortBy,
      publishedStatus,
      bodySearchTerm,
    } = requiredParamsValuesForQuizQuestions;

    const skip = (+pageNumber - 1) * +pageSize;

    console.log('bodySearchTerm', bodySearchTerm);

    const pblsStatus = publishedStatus === 'published';

    const questionsQuery = this.quizQuestionRepo
      .createQueryBuilder('q')
      .where(`q.body Ilike :bodySearchTerm`, {
        bodySearchTerm: `%${bodySearchTerm}%`,
      })
      .andWhere(
        publishedStatus === 'all'
          ? '"published" IN(:...ids)'
          : `"published" = ${pblsStatus}`,
        {
          ids: [true, false],
        },
      )
      .orderBy(`q.${sortBy}`, `${sortDirection}`)
      .offset(+skip)
      .limit(+pageSize);
    const [items, count] = await questionsQuery.getManyAndCount();
    return { count, items };
  }

  async createQuestion(quizQuestionsEntity: QuizQuestionsEntity) {
    await this.quizQuestionRepo.insert(quizQuestionsEntity);
  }

  async getRandomQuestions(quantity: number) {
    return await this.quizQuestionRepo
      .createQueryBuilder('q')
      .select()
      .where('q."published" = TRUE')
      .orderBy('RANDOM()')
      .limit(quantity)
      .getMany();
  }

  async updateQuestion(
    id: string,
    updateQuestionDTO: CreateOrUpdateQuestionDto,
  ) {
    const { correctAnswers, body } = updateQuestionDTO;

    const question = await this.quizQuestionRepo.findOne({ where: { id } });
    if (question) {
      question.updatedAt = new Date();
      question.body = body;
      question.correctAnswers = correctAnswers;
      await this.quizQuestionRepo.save(question);
      return true;
    } else {
      return false;
    }
  }

  async publishQuestion(id: string, publish: boolean) {
    const question = await this.quizQuestionRepo.findOne({ where: { id } });
    if (question) {
      question.published = publish;
      question.updatedAt = new Date();
      await this.quizQuestionRepo.save(question);
      return true;
    } else {
      return false;
    }
  }
  async deleteQuestionById(id: string) {
    const result = await this.quizQuestionRepo
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
    return result!.affected! > 0;
  }

  async clearData() {
    await this.dataSource.query(
      `TRUNCATE TABLE public."QuizQuestions" CASCADE;`,
      [],
    );
  }
}
