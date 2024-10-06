import { Injectable } from '@nestjs/common';
import { RequiredParamsValuesForBlogs } from 'src/shared/common-types';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getBlogById(id: string) {
    const query = `SELECT id, name, description, "websiteUrl", "createdAt", "isMembership"
     FROM public."Blogs"
     WHERE "id" = $1`;
    return (await this.dataSource.query(query, [id]))[0];
  }

  async findAll(params: RequiredParamsValuesForBlogs) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      params;

    const countQuery = `SELECT COUNT(*) FROM public."Blogs"
  WHERE name ILIKE '%${searchNameTerm}%'`;
    const [{ count: totalCount }] = await this.dataSource.query(countQuery, []);
    const skip = (+pageNumber - 1) * +pageSize;
    const query = `
 SELECT id, name, description, "websiteUrl", "createdAt", "isMembership"
  FROM public."Blogs"
  WHERE  name ILIKE '%${searchNameTerm}%'
  ORDER BY "${sortBy}" ${sortDirection}
   LIMIT ${+pageSize} OFFSET ${+skip}
`;

    const items = await this.dataSource.query(query);

    return {
      pagesCount: Math.ceil(+totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items,
    };
  }

  getBlogNameById(id: string) {
    const query = `
    SELECT name
    FROM public."Blogs"
    WHERE "id" = $1
`;
    return this.dataSource.query(query, [id]);
  }
}
