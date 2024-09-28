import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class PostsLikesQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getLikeRecord(userId: string | null, postId: string) {
    const query = `SELECT id, "userId", "likeStatus", "postId", "addedAt", "login"
   FROM public."PostsReactions"
   WHERE "userId" = $1 AND "postId" = $2`;
    const result = await this.dataSource.query(query, [userId, postId]);
    return result.length ? result[0] : null;
  }

  async getNewestLikes(postId: string) {
    const query = `
      SELECT "userId","login","addedAt"
    FROM public."PostsReactions"
    WHERE "postId" = $1 AND "likeStatus" = 'Like'
    ORDER BY "addedAt" DESC
    LIMIT 3
`;

    return await this.dataSource.query(query, [postId]);
  }

  async getLikesCount(postId: string) {
    const query = `
    SELECT count(*)
    FROM public."PostsReactions"
    WHERE "postId" = $1 AND "likeStatus" = 'Like'`;
    return await this.dataSource.query(query, [postId]);
  }

  async getDislikesCount(postId: string) {
    const query = `
    SELECT count(*)
    FROM public."PostsReactions"
    WHERE "postId" = $1 AND "likeStatus" = 'Dislike'`;
    return await this.dataSource.query(query, [postId]);
  }
}
