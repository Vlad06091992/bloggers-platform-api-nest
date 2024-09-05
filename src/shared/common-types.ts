export type ParamsValues =
  | 'sortBy'
  | 'sortDirection'
  | 'pageNumber'
  | 'pageSize'
  | 'searchLoginTerm'
  | 'searchEmailTerm'
  | 'searchNameTerm';

export type QueryParams = Partial<Record<ParamsValues, string>>;

export type RequiredParamsValuesForUsers = Omit<
  Record<ParamsValues, string>,
  'searchNameTerm'
>;

export type RequiredParamsValuesForBlogs = Omit<
  Record<ParamsValues, string>,
  'searchLoginTerm' | 'searchEmailTerm'
>;

export type RequiredParamsValuesForPosts = Omit<
  Record<ParamsValues, string>,
  'searchLoginTerm' | 'searchEmailTerm' | 'searchNameTerm'
>;
