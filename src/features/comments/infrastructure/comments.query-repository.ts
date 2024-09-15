import { InjectModel } from '@nestjs/mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { Comment, CommentsModel } from '../domain/comments-schema';
import {
  QueryParams,
  RequiredParamsValuesForPostsOrComments,
} from 'src/shared/common-types';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  mapRawCommentToExtendedModel,
  mapRawUserToExtendedModel,
} from 'src/utils';
import { UsersQueryRepository } from 'src/features/users/infrastructure/users.query-repository';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentsModel: CommentsModel,
    @InjectDataSource() protected dataSource: DataSource,
    @Inject() protected usersQueryRepository: UsersQueryRepository,
  ) {}

  async getCommentById(commentId: string, userId: string | null) {
    const query = `
SELECT id, "postId", "userId", content, "createdAt",
(SELECT COUNT(*) FROM public."CommentsReactions"  WHERE "likeStatus" ='Like' AND "commentId" = $1 ) as LikesCount,
(SELECT COUNT(*) FROM public."CommentsReactions"  WHERE "likeStatus" ='Dislike' AND "commentId" = $1 ) as DislikesCount,
(SELECT COALESCE(
  (
    SELECT CASE
      WHEN ("likeStatus" = 'Like' AND "commentId" = $1) THEN 'Like'
      WHEN ("likeStatus" = 'Dislike' AND "commentId" = $1) THEN 'Dislike'
    END
    FROM public."CommentsReactions"
    WHERE "userId" = $2 AND "commentId" = $1
  ), 'None')) AS MyStatus
FROM public."Comments"
WHERE "id" = $1
`;
    return (await this.dataSource.query(query, [commentId, userId]))[0];
  }
  async getCommentsForPost(
    postId: string,
    params: RequiredParamsValuesForPostsOrComments,
    userId: string | null,
  ) {
    const countQuery = `SELECT COUNT(*) FROM public."Comments" WHERE "postId" = $1`;
    const [{ count: totalCount }] = await this.dataSource.query(countQuery, [
      postId,
    ]);

    const { pageNumber, pageSize, sortDirection, sortBy } = params;
    const skip = (+pageNumber - 1) * +pageSize;
    const query = `
SELECT id, "postId", "userId", content, "createdAt",
(SELECT COUNT(*) FROM public."CommentsReactions"  WHERE "likeStatus" ='Like' AND "commentId" = C."id" ) as LikesCount,
(SELECT COUNT(*) FROM public."CommentsReactions"  WHERE "likeStatus" ='Dislike' AND "commentId" = C."id" ) as DislikesCount,
(SELECT COALESCE(
  (
    SELECT CASE
      WHEN ("likeStatus" = 'Like' AND "commentId" = C."id") THEN 'Like'
      WHEN ("likeStatus" = 'Dislike' AND "commentId" = C."id") THEN 'Dislike'
    END
    FROM public."CommentsReactions"
    WHERE "userId" = $2 AND "commentId" = C."id"
  ), 'None')) AS MyStatus
FROM public."Comments" as C
WHERE "postId" = $1
ORDER BY "${sortBy}" ${sortDirection}
OFFSET ${skip} LIMIT ${+pageSize} `;
    console.log();
    const comments = await this.dataSource.query(query, [postId, userId]);
    const items = await Promise.all(
      comments.map(mapRawCommentToExtendedModel.bind(this)),
    );

    return {
      pagesCount: Math.ceil(+totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items,
    };
  }
}
