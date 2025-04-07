import {createParamDecorator, ExecutionContext} from '@nestjs/common';

export const getValidQueryParamsForTopUsers = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        const isValidSortValues = new Set(["winsCount",
            "lossesCount",
            "drawsCount",
            "gamesCount",
            "sumScore",
            "avgScores"
        ])

        let sort = request.query?.sort || [ 'avgScores desc', 'sumScore desc' ]


        if (typeof sort === 'string'){
            sort = [sort]
        }

        const validSortParams = sort.reduce((acc,el,index)=>{

            const [value,direction] = el.split(' ')

            if(isValidSortValues.has(value) && (direction === 'desc' || direction === 'asc')){
                return {
                   ...acc , ...({[index] : {[value]: direction.toUpperCase()}})
                }
            }

        },{})

        const {
            pageNumber = '1',
            pageSize = '10',
        } = request.query;

        return {
            pageNumber,
            pageSize,
            validSortParams
        };
    },
);
