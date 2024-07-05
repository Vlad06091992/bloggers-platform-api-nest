export async function pagination(
  {
    pageNumber = 1,
    pageSize = 10,
    sortBy,
    sortDirection,
    map_callback,
    searchLoginTerm,
    searchEmailTerm,
  },
  projection = {},
) {
  const filter = {
    $or: [
      searchEmailTerm
        ? { email: { $regex: searchEmailTerm, $options: 'i' } }
        : searchLoginTerm
          ? { login: { $regex: searchLoginTerm, $options: 'i' } }
          : {},
    ],
  };

  const number = (+pageNumber - 1) * +pageSize;
  const res = await this.find(filter, projection)
    .skip(number)
    .limit(+pageSize)
    .sort({ [sortBy]: sortDirection == 'asc' ? 1 : -1 })
    .lean();

  const totalCount = await this.countDocuments();

  return {
    pagesCount: Math.ceil(+totalCount / +pageSize),
    page: +pageNumber,
    pageSize: +pageSize,
    totalCount: +totalCount,
    items: map_callback ? res.map(await map_callback) : res,
  };
}
