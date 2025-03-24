import { Inject, Injectable } from '@nestjs/common';
import { RequiredParamsValuesForPostsOrComments } from '../../../shared/common-types';
import { PostsRepository } from 'src/features/posts/infrastructure/posts-repository';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { CreatePostDto } from 'src/features/posts/api/models/create-post.dto';

import { UpdatePostDto } from 'src/features/posts/api/models/update-post.dto';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';
import { CommandBus } from '@nestjs/cqrs';
import { generateUuidV4 } from 'src/utils';
import { BlogsQueryRepository } from 'src/features/blogs/infrastructure/blogs.query-repository';
import { UsersQueryRepository } from 'src/features/users/infrastructure/users.query-repository';
import { PostsReactionsQueryRepository } from 'src/features/posts-reactions/infrastructure/posts-reactions-query-repository';
import { PostsEntity } from 'src/features/posts/entity/posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @Inject() protected postsRepository: PostsRepository,
    @Inject()
    protected postsReactionsQueryRepository: PostsReactionsQueryRepository,
    @Inject() protected usersQueryRepository: UsersQueryRepository,
    @Inject() protected blogsQueryRepository: BlogsQueryRepository,
    @Inject() protected commentsQueryRepository: CommentsQueryRepository,
    @Inject() protected postsQueryRepository: PostsQueryRepository,
    @Inject() protected commandBus: CommandBus,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const { shortDescription, content, blogId, title } = createPostDto;
    const id = generateUuidV4();
    const blog = (await this.blogsQueryRepository.getBlogById(blogId))!;
    const createdAt = new Date();
    const newPost = new PostsEntity(
      id,
      title,
      shortDescription,
      content,
      blog,
      blog.name,
      createdAt,
    );

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
    // response.items = await Promise.all(
    //   response.items.map(async (post) => {
    //     const newestLikes = await this.postsLikesQueryRepository.getNewestLikes(
    //       post?.id,
    //     );
    //
    //     return {
    //       ...post,
    //       // extendedLikesInfo: { ...post.extendedLikesInfo, newestLikes },
    //     };
    //   }),
    // );

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

  async findOnePostByIdWithLikesAndReactions(
    id: string,
    userId: string | null,
  ) {
    return await this.postsQueryRepository.getPostByIdWithLikesAndReactions(
      id,
      userId,
    );
  }

  async findOnePost(id: string) {
    return await this.postsQueryRepository.getPostById(id);
  }

  async updateOne(id: string, updatePostDTO: UpdatePostDto) {
    return await this.postsRepository.updatePost(id, updatePostDTO);
  }

  remove(id: string) {
    return this.postsRepository.removePostById(id);
  }
}
