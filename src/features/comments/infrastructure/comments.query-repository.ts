import { Inject, Injectable } from '@nestjs/common';
import { RequiredParamsValuesForPostsOrComments } from 'src/shared/common-types';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UsersQueryRepository } from 'src/features/users/infrastructure/users.query-repository';
import { Posts } from 'src/features/posts/entity/posts';
import { Comments } from 'src/features/comments/entity/comments';
import { mappedCommentsToResponse } from 'src/features/comments/utils';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @Inject() protected usersQueryRepository: UsersQueryRepository,
    @InjectRepository(Comments) protected postsRepo: Repository<Posts>,
    @InjectRepository(Comments) protected commentsRepo: Repository<Comments>,
  ) {}

  async getCommentById(commentId: string, userId: string | null) {
    const commentsFromBuilder = this.commentsRepo
      .createQueryBuilder('c')
      .select([
        'c.id as "id"',
        'c.content as "content"',
        'c."createdAt" as "createdAt"',
      ])
      .select()
      .where('c.id = :commentId', { commentId })
      .leftJoinAndSelect(
        (qb) => {
          return qb
            .select(['id as "userId"', 'login as "userLogin"'])
            .from('Users', 'user');
        },
        'commentatorInfo',
        'c."userId" = "commentatorInfo"."userId"',
      )
      .addSelect(
        `(SELECT COUNT(*) FROM "CommentsReactions" WHERE "likeStatus" = 'Like' AND "commentId" = c.id)`,
        'likesCount',
      )
      .addSelect(
        `(SELECT COUNT(*) FROM "CommentsReactions" WHERE "likeStatus" = 'Dislike' AND "commentId" = c.id)`,
        'dislikesCount',
      );

    if (userId) {
      console.log(userId);
      commentsFromBuilder.addSelect(
        `(SELECT "likeStatus" FROM public."CommentsReactions" AS "cr"
         WHERE "cr"."userId" = '${userId}' AND "cr"."commentId" = '${commentId}')`,
        'myStatus',
      );
    }
    const result = await commentsFromBuilder.getRawOne();

    return result ? mappedCommentsToResponse(result) : null;
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

    debugger;

    const skip = (+pageNumber - 1) * +pageSize;
    const commentsFromBuilder = this.commentsRepo
      .createQueryBuilder('c')
      .select([
        'c.id as "id"',
        'c.content as "content"',
        'c.createdAt as "createdAt"',
      ])
      .select()
      .where('c.postId = :postId', { postId })
      .leftJoinAndSelect(
        (qb) => {
          return qb
            .select(['id as "userId"', 'login as "userLogin"'])
            .from('Users', 'user');
        },
        'commentatorInfo',
        'c."userId" = "commentatorInfo"."userId"',
      )
      .addSelect(
        `(SELECT COUNT(*) FROM "CommentsReactions" WHERE "likeStatus" = 'Like' AND "commentId" = c.id)`,
        'likesCount',
      )
      .addSelect(
        `(SELECT COUNT(*) FROM "CommentsReactions" WHERE "likeStatus" = 'Dislike' AND "commentId" = c.id)`,
        'dislikesCount',
      );

    if (userId) {
      commentsFromBuilder.addSelect(
        `(SELECT "likeStatus" FROM public."CommentsReactions" AS "cr"
         WHERE "cr"."userId" = '${userId}' AND "cr"."commentId" = c.id)`,
        'myStatus',
      );
    }

    console.log('----------------------------');
    console.log(sortDirection);
    console.log('----------------------------');

    console.log('----------------------------');
    console.log(sortBy);
    console.log('----------------------------');

    console.log('----------------------------');
    console.log(+skip);
    console.log('----------------------------');

    console.log('----------------------------');
    console.log(+pageSize);
    console.log('----------------------------');

    const result = await commentsFromBuilder
      // .orderBy(`"${sortBy}"`, `${sortDirection}`)
      // // .skip(+pageSize) //offset
      // .offset(+pageSize)
      // // .take(+skip) //limit
      // .limit(+skip)
      .orderBy(`"${sortBy}"`, `${sortDirection}`)
      .offset(+skip)
      .limit(+pageSize)
      .getRawMany();

    return {
      pagesCount: Math.ceil(+totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: result.map(mappedCommentsToResponse),
    };
  }
}
