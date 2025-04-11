import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from 'src/features/quiz/infrastructure/quiz-repository';

export class StatisticCommand {
  constructor(public userId: string) {}
}

@CommandHandler(StatisticCommand)
export class StatisticHandler implements ICommandHandler<StatisticCommand> {
  constructor(protected quizRepository: QuizRepository) {}

  async execute({ userId }: StatisticCommand) {
    const gamesCount = await this.quizRepository.findGamesCountByuserId(userId);
    const sumScore = await this.quizRepository.findScoreCountByUserId(userId);
    const winsCount = await this.quizRepository.getWinsCount(userId);
    const lossesCount = await this.quizRepository.getLoseCount(userId);
    const drawsCount = await this.quizRepository.getDrawCount(userId);

    /*
- sumScore: общая сумма набранных очков игроком или командой. Это может быть сумма всех очков, набранных за определенный период времени или за все игры, в которых они участвовали.

- avgScores: среднее количество очков, набранных за игру. Это значение может быть рассчитано как отношение sumScore к gamesCount, то есть общая сумма очков делится на количество игр.

- gamesCount: количество игр, в которых игрок или команда приняли участие.

- winsCount: количество побед, одержанных игроком или командой.

- lossesCount: количество поражений, которые потерпел игрок или команда.

- drawsCount: количество игр, которые закончились вничью для игрока или команды.
*/

    return {
      sumScore,
      avgScores: +(sumScore! / gamesCount!).toFixed(2) || 0,
      gamesCount,
      winsCount,
      lossesCount,
      drawsCount,
    };
  }
}
