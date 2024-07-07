export type ParamsValues =
  | 'sortBy'
  | 'sortDirection'
  | 'pageNumber'
  | 'pageSize'
  | 'searchLoginTerm'
  | 'searchEmailTerm'
  | 'searchNameTerm';

export type QueryParams = Partial<Record<ParamsValues, string>>;
