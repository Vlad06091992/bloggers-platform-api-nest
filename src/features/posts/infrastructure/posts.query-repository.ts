import { Injectable } from '@nestjs/common';
import { RequiredParamsValuesForPostsOrComments } from 'src/shared/common-types';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostsEntity } from 'src/features/posts/entity/posts.entity';
import { PostsReactions } from 'src/features/posts-reactions/entity/post-reactions.entity';
import { UsersEntity } from 'src/features/users/entities/users.entity';
import { transformPost } from 'src/features/posts/utils';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(PostsEntity) protected repo: Repository<PostsEntity>,
  ) {}

  async getPostByIdWithLikesAndReactions(
    postId: string,
    userId: string | null,
  ) {
    let post = this.repo
      .createQueryBuilder('p')
      .select([
        'p.title as title',
        'p.id as id',
        'p.shortDescription as shortDescription',
        'p.content as content',
        'p.blogId as blogId',
        'p.blogName as blogName',
        'p.createdAt as createdAt',
      ])
      .addSelect((qb1) =>
        qb1
          .select(
            `COALESCE(jsonb_agg(json_build_object('login', prs.login, 'userId', prs."userId", 'addedAt', prs."addedAt")),'[]')`,
            'newestLikes',
          )
          .from((qb2) => {
            return qb2
              .select('pr.*')
              .addSelect((qb3) => {
                return qb3
                  .select('u.login')
                  .from(UsersEntity, 'u')
                  .where('pr.userId = u.id');
              }, 'login')
              .from(PostsReactions, 'pr')
              .where('p.id = pr.postId')
              .andWhere('pr.likeStatus = :likeStatus', { likeStatus: 'Like' })
              .orderBy('pr.addedAt', 'DESC')
              .limit(3);
          }, 'prs'),
      )
      .addSelect(
        `(SELECT COUNT(*) FROM "PostsReactions" WHERE "likeStatus" = 'Like' AND "postId" = p.id)`,
        'likesCount',
      )
      .addSelect(
        `(SELECT COUNT(*) FROM "PostsReactions" WHERE "likeStatus" = 'Dislike' AND "postId" = p.id)`,
        'dislikesCount',
      );

    if (userId) {
      post = post.addSelect(
        `(SELECT pr."likeStatus" FROM "PostsReactions" pr WHERE "postId" = p.id AND pr."userId" = '${userId}')`,
        'myStatus',
      );
    }

    const result = await post
      .where('p.id = :postId')
      .setParameter('postId', postId)
      .getRawOne();

    return result ? transformPost(result) : null;
  }

  async getPostById(postId: string) {
    const post = await this.repo
      .createQueryBuilder('p')
      .select()
      .where('p.id = :postId', { postId })
      .getOne();
    return post;
  }

  async findPostsForSpecificBlog(
    params: RequiredParamsValuesForPostsOrComments,
    blogId,
    userId: string | null,
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection } = params;
    const totalCount = await this.repo
      .createQueryBuilder('p')
      .select()
      .where('p.blogId =:blogId', { blogId })
      .getCount();
    const skip = (+pageNumber - 1) * +pageSize;

    let posts = this.repo
      .createQueryBuilder('p')
      .select([
        'p.title as title',
        'p.id as id',
        'p.shortDescription as shortDescription',
        'p.content as content',
        'p.blogId as blogId',
        'p.blogName as blogName',
        'p.createdAt as createdAt',
      ])
      .addSelect((qb1) =>
        qb1
          .select(
            `COALESCE(jsonb_agg(json_build_object('login', prs.login, 'userId', prs."userId", 'addedAt', prs."addedAt")),'[]')`,
            'newestLikes',
          )
          .from((qb2) => {
            return qb2
              .select('pr.*')
              .addSelect((qb3) => {
                return qb3
                  .select('u.login')
                  .from(UsersEntity, 'u')
                  .where('pr.userId = u.id');
              }, 'login')
              .from(PostsReactions, 'pr')
              .where('p.id = pr.postId')
              .andWhere('pr.likeStatus = :likeStatus', { likeStatus: 'Like' })
              .orderBy('pr.addedAt', 'DESC')
              .limit(3);
          }, 'prs'),
      )
      .addSelect(
        `(SELECT COUNT(*) FROM "PostsReactions" WHERE "likeStatus" = 'Like' AND "postId" = p.id)`,
        'likesCount',
      )
      .addSelect(
        `(SELECT COUNT(*) FROM "PostsReactions" WHERE "likeStatus" = 'Dislike' AND "postId" = p.id)`,
        'dislikesCount',
      );

    if (userId) {
      posts = posts
        .addSelect(
          `(SELECT pr."likeStatus" FROM "PostsReactions" pr WHERE "postId" = p.id AND pr."userId" = '${userId}')`,
          'myStatus',
        )
        .setParameter('userId', userId);
    }

    let result = await posts
      .where('p.blogId = :blogId')
      .setParameter('blogId', blogId)
      .orderBy(`p.${sortBy}`, sortDirection)
      .skip(+skip)
      .take(+pageSize)
      .getRawMany();

    result = result.map((p) =>
      'myStatus' in p
        ? p['myStatus'] != null
          ? p
          : { ...p, myStatus: 'None' }
        : { ...p, myStatus: 'None' },
    );

    return {
      pagesCount: Math.ceil(+totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: result.map(transformPost),
    };
  }

  async findAll(
    params: RequiredParamsValuesForPostsOrComments,
    userId: string | null,
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection } = params;
    const totalCount = await this.repo.createQueryBuilder('p').getCount();
    const skip = (+pageNumber - 1) * +pageSize;

    let posts = this.repo
      .createQueryBuilder('p')
      .select([
        'p.title as title',
        'p.id as id',
        'p.shortDescription as shortDescription',
        'p.content as content',
        'p.blogId as blogId',
        'p.blogName as blogName',
        'p.createdAt as createdAt',
      ])
      .addSelect((qb1) =>
        qb1
          .select(
            `COALESCE(jsonb_agg(json_build_object('login', prs.login, 'userId', prs."userId", 'addedAt', prs."addedAt")),'[]')`,
            'newestLikes',
          )
          .from((qb2) => {
            return qb2
              .select('pr.*')
              .addSelect((qb3) => {
                return qb3
                  .select('u.login')
                  .from(UsersEntity, 'u')
                  .where('pr.userId = u.id');
              }, 'login')
              .from(PostsReactions, 'pr')
              .where('p.id = pr.postId')
              .andWhere('pr.likeStatus = :likeStatus', { likeStatus: 'Like' })
              .orderBy('pr.addedAt', 'DESC')
              .limit(3);
          }, 'prs'),
      )
      .addSelect(
        `(SELECT COUNT(*) FROM "PostsReactions" WHERE "likeStatus" = 'Like' AND "postId" = p.id)`,
        'likesCount',
      )
      .addSelect(
        `(SELECT COUNT(*) FROM "PostsReactions" WHERE "likeStatus" = 'Dislike' AND "postId" = p.id)`,
        'dislikesCount',
      );

    if (userId) {
      posts = posts
        .addSelect(
          `(SELECT pr."likeStatus" FROM "PostsReactions" pr WHERE "postId" = p.id AND pr."userId" = '${userId}')`,
          'myStatus',
        )
        .setParameter('userId', userId);
    }

    let result = await posts
      .orderBy(`p.${sortBy}`, sortDirection)
      .skip(+skip)
      .take(+pageSize)
      .getRawMany();

    result = result.map((p) =>
      'myStatus' in p
        ? p['myStatus'] != null
          ? p
          : { ...p, myStatus: 'None' }
        : { ...p, myStatus: 'None' },
    );

    return {
      pagesCount: Math.ceil(+totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: result.map(transformPost),
    };
  }
}
