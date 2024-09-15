import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import { LikeStatuses } from 'src/features/comments-likes/api/models/like-status-dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostLikes } from 'src/features/posts-likes/domain/post-likes-schema';

@Injectable()
export class PostsLikesRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  async createLikeStatus(record: PostLikes) {
    const { postId, userId, likeStatus, id, login, addedAt } = record;
    debugger;
    const query = `INSERT INTO public."PostsReactions"(
      id, "userId", "likeStatus", "postId", "addedAt", "login")
    VALUES ($1, $2, $3, $4, $5, $6)`;

    await this.dataSource.query(query, [
      id,
      userId,
      likeStatus,
      postId,
      addedAt,
      login,
    ]);
  }

  async updateLikeStatus(postId: string, likeStatus: LikeStatuses) {
    const query = `UPDATE public."PostsReactions"
    SET "likeStatus"=$1
      WHERE "postId"=$2;`;
    await this.dataSource.query(query, [likeStatus, postId]);
  }

  async deleteRecord(id: string) {
    const query = `DELETE FROM public."PostsReactions"
         WHERE "id" = $1`;
    const result = await this.dataSource.query(query, [id]);
    return result[1] == 1;
  }

  async clearData() {
    const query = `TRUNCATE TABLE public."PostsReactions"`;
    return this.dataSource.query(query, []);
  }
}
