import { Inject, Injectable } from '@nestjs/common';
import { RequiredParamsValuesForPostsOrComments } from '../../../shared/common-types';
import { PostsRepository } from 'src/features/posts/infrastructure/posts-repository';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { CreatePostDto } from 'src/features/posts/api/models/create-post.dto';
import { Post } from 'src/features/posts/domain/posts-schema';
import { UpdatePostDto } from 'src/features/posts/api/models/update-post.dto';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';
import { CommandBus } from '@nestjs/cqrs';
import { GetLikeInfoCommand } from 'src/features/comments-likes/application/use-cases/get-like-info';
import { generateUuidV4, mapRawCommentToExtendedModel } from 'src/utils';
import { BlogsQueryRepository } from 'src/features/blogs/infrastructure/blogs.query-repository';
import { UsersQueryRepository } from 'src/features/users/infrastructure/users.query-repository';
import { PostsLikesQueryRepository } from 'src/features/posts-likes/infrastructure/posts-likes-query-repository';

@Injectable()
export class PostsService {
  constructor(
    @Inject() protected postsRepository: PostsRepository,
    @Inject() protected postsLikesQueryRepository: PostsLikesQueryRepository,
    @Inject() protected usersQueryRepository: UsersQueryRepository,
    @Inject() protected blogsQueryRepository: BlogsQueryRepository,
    @Inject() protected commentsQueryRepository: CommentsQueryRepository,
    @Inject() protected postsQueryRepository: PostsQueryRepository,
    @Inject() protected commandBus: CommandBus,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const { shortDescription, content, blogId, title } = createPostDto;
    const id = generateUuidV4();
    const blogName = (
      await this.blogsQueryRepository.getBlogNameById(blogId)
    )[0].name;

    const newPost: Post = {
      id,
      title: title,
      shortDescription: shortDescription,
      content,
      blogId,
      blogName,
      createdAt: new Date().toISOString(),
    };

    const extendedLikesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    };

    return {
      ...(await this.postsRepository.createPost(newPost)),
      extendedLikesInfo,
    };
  }

  async findAll(
    params: RequiredParamsValuesForPostsOrComments,
    userId: string | null,
  ) {
    const response = await this.postsQueryRepository.findAll(params, userId);
    response.items = await Promise.all(
      response.items.map(async (post) => {
        const newestLikes = await this.postsLikesQueryRepository.getNewestLikes(
          post?.id,
        );

        return {
          ...post,
          extendedLikesInfo: { ...post.extendedLikesInfo, newestLikes },
        };
      }),
    );

    return response;
  }

  async getCommentsForPost(
    postId: string,
    queryParams: RequiredParamsValuesForPostsOrComments,
    userId: string | null,
  ) {
    const comments = await this.commentsQueryRepository.getCommentsForPost(
      postId,
      queryParams,
      userId,
    );
    return comments;
  }

  async findOne(id: string, userId: string | null) {
    const post =
      await this.postsQueryRepository.getPostWithExtendedLikesInfoById(
        id,
        userId,
      );

    if (post) {
      const newestLikes = await this.postsLikesQueryRepository.getNewestLikes(
        post?.id,
      );

      return {
        ...post,
        extendedLikesInfo: { ...post.extendedLikesInfo, newestLikes },
      };
    }
    return null;
  }

  async updateOne(id: string, updatePostDTO: UpdatePostDto) {
    return await this.postsRepository.updatePost(id, updatePostDTO);
  }

  remove(id: string) {
    return this.postsRepository.removePostById(id);
  }
}
