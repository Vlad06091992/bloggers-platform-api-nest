export type SortDirection = 'ASC' | 'DESC';
export type PublishedStatus = 'all' | 'published' | 'notPublished';

export type GameStats =
    | "winsCount"
    | "lossesCount"
    | "drawsCount"
    | "gamesCount"
    | "sumScore"
    | "avgScore";


export type ParamsValues =
  | 'sortBy'
  | 'sortDirection'
  | 'pageNumber'
  | 'pageSize'
  | 'searchLoginTerm'
  | 'searchEmailTerm'
  | 'searchNameTerm';

export type RequiredParamsValuesForTopUsers = Omit<
  Record<ParamsValues, string>,
  'searchNameTerm' | 'sortDirection' | 'searchLoginTerm' | 'sortBy' | 'searchEmailTerm'
> & {
  sort: string;
} &
    {
  validSortParams: {[key:number]:{
    value:GameStats,
      direction:'ASC' | 'DESC'
    }};
}

export type RequiredParamsValuesForMyGames = Omit<
  Record<ParamsValues, string>,
  'searchNameTerm' | 'sortDirection' | 'searchLoginTerm'
> & {
  sortDirection: SortDirection;
};

export type RequiredParamsValuesForUsers = Omit<
  Record<ParamsValues, string>,
  'searchNameTerm' | 'sortDirection'
> & {
  sortDirection: SortDirection;
};

export type RequiredParamsValuesForBlogs = Omit<
  Record<ParamsValues, string>,
  'searchLoginTerm' | 'searchEmailTerm' | 'sortDirection'
> & {
  sortDirection: SortDirection;
};
export type RequiredParamsValuesForPostsOrComments = Omit<
  Record<ParamsValues, string>,
  'searchLoginTerm' | 'searchEmailTerm' | 'searchNameTerm' | 'sortDirection'
> & {
  sortDirection: SortDirection;
};

export type RequiredParamsValuesForQuizQuestions = Omit<
  Record<ParamsValues, string>,
  'searchLoginTerm' | 'searchEmailTerm' | 'searchNameTerm' | 'sortDirection'
> & {
  sortDirection: SortDirection;
  bodySearchTerm: string;
  publishedStatus: PublishedStatus;
};
