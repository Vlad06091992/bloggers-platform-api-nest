export async function pagination(
  {
    pageNumber = 1,
    pageSize = 10,
    sortBy = 'createdAt',
    sortDirection = 'desc',
    map_callback,
    filter = {},
  },
  projection = {},
) {
  const number = (+pageNumber - 1) * +pageSize;
  const res = await this.find(filter, projection)
    .skip(number)
    .limit(+pageSize)
    // .sort({ createdAt: -1  })
    .sort({
      [sortBy]: sortDirection == 'asc' ? 1 : -1,
      createdAt: sortDirection == 'asc' ? 1 : -1,
    })
    // .sort({ [sortBy === 'blogName' ? 'createdAt' : sortBy]: sortDirection == 'asc' ? 1 : -1 })
    .lean();

  const totalCount = await this.countDocuments(filter);

  return {
    pagesCount: Math.ceil(+totalCount / +pageSize),
    page: +pageNumber,
    pageSize: +pageSize,
    totalCount: +totalCount,
    items: map_callback ? res.map(await map_callback) : res,
  };
}
