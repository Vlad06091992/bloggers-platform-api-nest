import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommentsEntity } from 'src/features/comments/entity/comments.entity';
import { CommentsReactions } from 'src/features/comments-reactions/entity/comment-reactions.entity';
import { UsersEntity } from 'src/features/users/entities/users.entity';

export class CommentsReactionsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(CommentsReactions)
    protected repo: Repository<CommentsReactions>,
  ) {}

  async getLikeRecord(userId: string | null, commentId: string) {
    const result = await this.repo.findOne({
      where: {
        comment: { id: commentId } as CommentsEntity,
        user: { id: userId } as UsersEntity,
      },
    });
    // const result = await this.repo.findOne({
    //   userId,
    //   commentId,
    // });

    return result;
  }

  async getNewestLikes(commentId: string) {
    const query = `
    SELECT "userId","login","addedAt"
    FROM public."CommentsReactions"
      WHERE "postId" = $1 AND "likeStatus" = 'Like'
    ORDER BY "addedAt" DESC
    LIMIT 3
`;

    return await this.dataSource.query(query, [commentId]);
  }

  async getLikesCount(commentId: string) {
    const query = `
    SELECT count(*)
    FROM public."CommentsReactions"
    WHERE "commentId" = $1 AND "likeStatus" = 'Like'`;
    return await this.dataSource.query(query, [commentId]);
  }

  async getDislikesCount(commentId: string) {
    const query = `
    SELECT count(*)
    FROM public."CommentsReactions"
    WHERE "commentId" = $1 AND "likeStatus" = 'Dislike'`;
    return await this.dataSource.query(query, [commentId]);
  }
}
