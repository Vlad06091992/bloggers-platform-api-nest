import { Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { QueryParams } from '../../../shared/common-types';
import { PostsRepository } from 'src/features/posts/infrastructure/posts-repository';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { CreatePostDto } from 'src/features/posts/api/models/create-post.dto';
import { Post } from 'src/features/posts/domain/posts-schema';
import { UpdatePostDto } from 'src/features/posts/api/models/update-post.dto';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';
import { CommandBus } from '@nestjs/cqrs';
import {
  GetLikeInfoCommand,
  GetLikeInfoHandler,
} from 'src/features/likes/application/use-cases/get-like-info';
import { GetNewestLikesCommand } from 'src/features/likes/application/use-cases/get-newest-likes';

@Injectable()
export class PostsService {
  constructor(
    @Inject() protected postsRepository: PostsRepository,
    @Inject() protected commentsQueryRepository: CommentsQueryRepository,
    @Inject() protected postsQueryRepository: PostsQueryRepository,
    @Inject() protected commandBus: CommandBus,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const _id = new ObjectId();
    const blogName = 'blogName';

    const newPost: Post = {
      _id,
      id: _id.toString(),
      title: createPostDto.title,
      shortDescription: createPostDto.shortDescription,
      content: createPostDto.content,
      blogId: createPostDto.blogId,
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

  async findAll(params: QueryParams, userId: string | null) {
    // return params;
    const posts = await this.postsQueryRepository.findAll(params);

    // console.log(posts);

    const result = posts.items.map(async (el) => ({
      ...el.toObject(),
      extendedLikesInfo: {
        ...(await this.commandBus.execute(
          new GetLikeInfoCommand(el.id, userId),
        )),
        newestLikes: await Promise.all(
          await this.commandBus.execute(new GetNewestLikesCommand(el.id)),
        ),
      },
    }));
    posts.items = await Promise.all(result);

    const hz = await Promise.all(
      await this.commandBus.execute(
        new GetNewestLikesCommand('66a61c56800fc6b8294d55e9'),
      ),
    );

    console.log(typeof hz);
    return posts;
  }

  async getCommentsForPost(
    postId: string,
    queryParams: QueryParams,
    userId: string | null,
  ) {
    const comments = await this.commentsQueryRepository.getCommentsForPost(
      postId,
      queryParams,
    );

    comments.items = await Promise.all(
      comments.items.map(async (el) => ({
        ...el,
        likesInfo: await this.commandBus.execute(
          new GetLikeInfoCommand(el.id, userId),
        ),
      })),
    );

    return comments;
  }

  async findOne(id: string, userId: string | null) {
    const post = await this.postsQueryRepository.getPostById(id, true);
    if (post) {
      const extendedLikesInfo = {
        ...(await this.commandBus.execute(
          new GetLikeInfoCommand(post.id, userId),
        )),
        newestLikes: await Promise.all(
          await this.commandBus.execute(new GetNewestLikesCommand(post.id)),
        ),
      };
      return { ...post.toObject(), extendedLikesInfo };
    }
    return null;
  }

  async updateOne(id: string, updatePostDTO: UpdatePostDto) {
    return await this.postsRepository.updatePost(id, updatePostDTO);
  }

  remove(id: string) {
    return this.postsQueryRepository.removePostById(id);
  }
}
