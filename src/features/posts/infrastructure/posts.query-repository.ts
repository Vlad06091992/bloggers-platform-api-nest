import { Injectable } from '@nestjs/common';
import { RequiredParamsValuesForPostsOrComments } from 'src/shared/common-types';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { mapRawPostToExtendedModel } from 'src/utils';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getPostWithExtendedLikesInfoById(
    postId: string,
    userId: string | null,
  ) {
    const query = `SELECT p.*,pr.id as postReactionId,pr."addedAt",pr."userId",u."login",b.name as "blogName",
(SELECT COUNT(*) FROM public."PostsReactions"  WHERE "likeStatus" ='Like' AND "postId" = $1 ) as LikesCount,
(SELECT COUNT(*) FROM public."PostsReactions"  WHERE "likeStatus" ='Dislike' AND "postId" = $1 ) as DislikesCount,
(SELECT COALESCE(
  (
    SELECT CASE
      WHEN ("likeStatus" = 'Like' AND "postId" = $1) THEN 'Like'
      WHEN ("likeStatus" = 'Dislike' AND "postId" = $1) THEN 'Dislike'
    END
    FROM public."PostsReactions"
    WHERE "userId" = $2 AND "postId" = $1
  ), 'None')) AS MyStatus

FROM public."Posts" as p 
LEFT JOIN public."PostsReactions" as pr
ON p."id" = pr."postId"
LEFT JOIN public."User" as u
ON pr."userId" = u."id"
LEFT JOIN public."Blogs" as b
ON P."blogId" = b."id"
WHERE p."id" = $1
ORDER BY PR."addedAt" DESC
LIMIT 3
`;

    try {
      const rawResult = await this.dataSource.query(query, [postId, userId]);
      if (!rawResult.length) return null;
      return mapRawPostToExtendedModel(rawResult);
    } catch (e) {
      debugger;
    }
  }

  async findPostsForSpecificBlog(
    params: RequiredParamsValuesForPostsOrComments,
    blogId: string,
    userId: string | null,
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection } = params;

    const countQuery = `SELECT COUNT(*) FROM public."Posts" WHERE "blogId" = $1`;
    const [{ count: totalCount }] = await this.dataSource.query(countQuery, [
      blogId,
    ]);
    debugger;
    const skip = (+pageNumber - 1) * +pageSize;

    const query = `
    SELECT id
    FROM public."Posts"
    WHERE "blogId" = $1
    ORDER BY "${sortBy}" ${sortDirection}
    LIMIT ${+pageSize} OFFSET ${+skip}
`;

    const itemsIds = await this.dataSource.query(query, [blogId]);

    return {
      pagesCount: Math.ceil(+totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: await Promise.all(
        itemsIds.map((el) =>
          this.getPostWithExtendedLikesInfoById(el.id, userId),
        ),
      ),
    };
  }

  async findAll(
    params: RequiredParamsValuesForPostsOrComments,
    userId: string | null,
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection } = params;

    const countQuery = `SELECT COUNT(*) FROM public."Posts"`;
    const [{ count: totalCount }] = await this.dataSource.query(countQuery, []);
    // const totalCount = await this.dataSource.query(countQuery, []);
    const skip = (+pageNumber - 1) * +pageSize;

    const query = `
    SELECT id
    FROM public."Posts"
    ORDER BY "${sortBy}" ${sortDirection}
    LIMIT ${+pageSize} OFFSET ${+skip}
`;

    const itemsIds = await this.dataSource.query(query);

    return {
      pagesCount: Math.ceil(+totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: await Promise.all(
        itemsIds.map((el) =>
          this.getPostWithExtendedLikesInfoById(el.id, userId),
        ),
      ),
    };
  }
}
