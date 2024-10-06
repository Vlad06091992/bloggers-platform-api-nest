export type SortDirection = 'ASC' | 'DESC';

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
