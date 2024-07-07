import { Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { QueryParams } from '../../../shared/common-types';
import { PostsRepository } from 'src/features/posts/infrastructure/posts-repository';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { CreatePostDto } from 'src/features/posts/api/models/create-post.dto';
import { Post } from 'src/features/posts/domain/posts-schema';
import { UpdatePostDto } from 'src/features/posts/api/models/update-post.dto';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';

@Injectable()
export class PostsService {
  constructor(
    @Inject() protected postsRepository: PostsRepository,
    @Inject() protected commentsQueryRepository: CommentsQueryRepository,
    @Inject() protected postsQueryRepository: PostsQueryRepository,
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
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [{ addedAt: new Date().toISOString(), login: 'login', userId: 'userId' }],
      },
    };

    return await this.postsRepository.createPost(newPost);
  }

  async findAll(params: QueryParams) {
    // return params;
    return await this.postsQueryRepository.findAll(params);
  }

  async getCommentsForPost(postId: string) {
    return this.commentsQueryRepository.getCommentsForPost(postId, true);
  }

  async findOne(id: string) {
    return await this.postsQueryRepository.getPostById(id, true);
  }

  async updateOne(id: string, updatePostDTO: UpdatePostDto) {
    return await this.postsRepository.updatePost(id, updatePostDTO);
  }

  remove(id: string) {
    return this.postsQueryRepository.removePostById(id);
  }
}
