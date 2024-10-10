import { Injectable } from '@nestjs/common';
import { RequiredParamsValuesForPostsOrComments } from 'src/shared/common-types';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Posts } from 'src/features/posts/entity/posts';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Posts) protected repo: Repository<Posts>,
  ) {}

  async getPostWithExtendedLikesInfoById(
    postId: string,
    userId: string | null,
  ) {
    const post = await this.repo
      .createQueryBuilder('p')
      .where('p.id = :postId', { postId })
      .loadRelationIdAndMap('p.blogId', 'p.blog')
      .getOne();

    return post
      ? {
          ...post,
          extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
            newestLikes: [],
          },
        }
      : null;
  }

  async findPostsForSpecificBlog(
    params: RequiredParamsValuesForPostsOrComments,
    blogId: string,
    userId: string | null,
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection } = params;
    const totalCount = await this.repo.createQueryBuilder('p').getCount();
    const skip = (+pageNumber - 1) * +pageSize;
    const posts = await this.repo
      .createQueryBuilder('p')
      .where('p.blogId = :blogId', { blogId })
      .loadRelationIdAndMap('p.blogId', 'p.blog')
      .orderBy(`p.${sortBy}`, sortDirection)
      .skip(+skip)
      .take(+pageSize)
      .getMany();

    return {
      pagesCount: Math.ceil(+totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: posts.map((el) => ({
        ...el,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [
            // {
            //   "addedAt": "2024-10-09T04:25:37.185Z",
            //   "userId": "string",
            //   "login": "string"
            // }
          ],
        },
      })),
    };
  }

  async findAll(
    params: RequiredParamsValuesForPostsOrComments,
    userId: string | null,
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection } = params;
    const totalCount = await this.repo.createQueryBuilder('p').getCount();
    const skip = (+pageNumber - 1) * +pageSize;

    const posts = await this.repo
      .createQueryBuilder('p')
      .loadRelationIdAndMap('p.blogId', 'p.blog')
      .orderBy(`p.${sortBy}`, sortDirection)
      .skip(+skip)
      .take(+pageSize)
      .getMany();

    return {
      pagesCount: Math.ceil(+totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: posts.map((el) => ({
        ...el,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [
            // {
            //   "addedAt": "2024-10-09T04:25:37.185Z",
            //   "userId": "string",
            //   "login": "string"
            // }
          ],
        },
      })),
    };
  }
}
