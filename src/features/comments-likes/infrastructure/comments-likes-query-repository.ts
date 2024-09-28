import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class CommentsLikesQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getLikeRecord(userId: string | null, commentId: string) {
    const query = `SELECT id, "userId", "likeStatus", "commentId", "addedAt", "login"
   FROM public."CommentsReactions"
   WHERE "userId" = $1 AND "commentId" = $2`;
    const result = await this.dataSource.query(query, [userId, commentId]);
    return result.length ? result[0] : null;
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
