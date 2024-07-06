import { Inject, Injectable } from '@nestjs/common';
import { CommentsRepository } from 'src/features/comments/infrastructure/comments-repository';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';

@Injectable()
export class CommentsService {
  constructor(
    @Inject() protected commentsRepository: CommentsRepository,
    @Inject() protected commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async findOne(id: string) {
    const newVar = await this.commentsQueryRepository.getCommentById(id, true);
    return newVar;
  }
}
