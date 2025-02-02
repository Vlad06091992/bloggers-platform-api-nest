import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { QuizController } from 'src/features/quiz/api/quiz-controller';

@Module({
  imports: [
    CqrsModule,
    // TypeOrmModule.forFeature([]),
  ],
  controllers: [QuizController],
  providers: [],
})
export class QuizModule {}
