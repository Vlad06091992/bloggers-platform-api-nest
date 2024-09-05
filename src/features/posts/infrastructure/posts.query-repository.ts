import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import {
  QueryParams,
  RequiredParamsValuesForPosts,
} from 'src/shared/common-types';
import { Post, PostModel } from 'src/features/posts/domain/posts-schema';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

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
    WHERE "userId" = $2
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
    const rawResult = await this.dataSource.query(query, [postId, userId]);
    if(!rawResult.length) return  null

    const post = {
      id: rawResult[0].id,
      title: rawResult[0].title,
      shortDescription: rawResult[0].shortDescription,
      content: rawResult[0].content,
      blogId: rawResult[0].blogId,
      blogName: rawResult[0].blogName,
      createdAt: rawResult[0].createdAt,
      extendedLikesInfo: {
        likesCount: +rawResult[0].likescount,
        dislikesCount: +rawResult[0].dislikescount,
        myStatus: rawResult[0].mystatus,
        newestLikes: rawResult.reduce((acc, el) => {
          if (el.postreactionid)
            acc.push({
              addedAt: el.addedAt,
              userId: el.userId,
              login: el.login,
            });
          return acc;
        }, []),
      },
    };

    return post;
  }

  async findPostsForSpecificBlog(
    params: RequiredParamsValuesForPosts,
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

  async findAll(params: RequiredParamsValuesForPosts, userId: string | null) {
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
