export type ParamsValues =
  | 'sortBy'
  | 'sortDirection'
  | 'pageNumber'
  | 'pageSize'
  | 'searchLoginTerm'
  | 'searchEmailTerm';

export type QueryParams = Partial<Record<ParamsValues, string>>;
