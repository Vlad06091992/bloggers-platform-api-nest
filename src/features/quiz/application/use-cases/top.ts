import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {QuizRepository} from 'src/features/quiz/infrastructure/quiz-repository';
import {RequiredParamsValuesForTopUsers} from "../../../../shared/common-types";

export class TopCommand {
    constructor(public params: RequiredParamsValuesForTopUsers) {
    }
}

@CommandHandler(TopCommand)
export class TopHandler implements ICommandHandler<TopCommand> {
    constructor(protected quizRepository: QuizRepository) {
    }

    async execute({params}) {
        const {items, totalCount} = await this.quizRepository.getTopUsers(params);

        const {pageSize, pageNumber} = params

        console.log('items', items)

        return {
            "pagesCount": Math.ceil(+totalCount / +pageSize),
            "page": +params.pageNumber,
            "pageSize": +pageSize,
            "totalCount": +totalCount,
            "items": items.map(el => {
                return {
                    sumScore: +el.sumScore,
                    avgScores: Number((+el.avgScores).toFixed(2)),
                    gamesCount: +el.gamesCount,
                    winsCount: +el.winsCount,
                    lossesCount: +el.lossesCount,
                    drawsCount: +el.drawsCount,
                    player: {
                        id:el.userId,
                        login:el.login
                    }
                }
            })
        }
    }
}
