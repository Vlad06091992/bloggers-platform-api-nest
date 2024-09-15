import { Injectable } from '@nestjs/common';

import { LikeStatuses } from 'src/features/comments-likes/api/models/like-status-dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentLikes } from 'src/features/comments-likes/domain/comment-likes-schema';

@Injectable()
export class CommentsLikesRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  async createLikeStatus(record: CommentLikes) {
    const { commentId, userId, likeStatus, id, login, addedAt } = record;
    const query = `INSERT INTO public."CommentsReactions"(
      id, "userId", "likeStatus", "commentId", "addedAt", "login")
    VALUES ($1, $2, $3, $4, $5, $6)`;

    await this.dataSource.query(query, [
      id,
      userId,
      likeStatus,
      commentId,
      addedAt,
      login,
    ]);
  }

  async updateLikeStatus(commentId: string, likeStatus: LikeStatuses) {
    const query = `UPDATE public."CommentsReactions"
    SET "likeStatus"=$1
      WHERE "commentId"=$2;`;
    await this.dataSource.query(query, [likeStatus, commentId]);
  }

  async deleteRecord(id: string) {
    const query = `DELETE FROM public."CommentsReactions"
         WHERE "id" = $1`;
    const result = await this.dataSource.query(query, [id]);
    return result[1] == 1;
  }

  async clearData() {
    const query = `TRUNCATE TABLE public."CommentsReactions"`;
    return this.dataSource.query(query, []);
  }
}
