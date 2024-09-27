import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from '../domain/comments-schema';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async updateCommentById(commentId: string, content: string) {
    const updateCommentQuery = `UPDATE public."Comments"
    SET "content"=$1
    WHERE "id" = $2;`;
    const result = await this.dataSource.query(updateCommentQuery, [
      content,
      commentId,
    ]);
    return (result[1] = 1);
  }

  async createComment(comment: Comment) {
    const { id, postId, userId, content, createdAt } = comment;

    // console.log(comment);

    const createCommentQuery = `INSERT INTO public."Comments"(
        "id","postId", "userId", "content", "createdAt")
     VALUES ($1, $2, $3, $4, $5)`;

    await this.dataSource.query(createCommentQuery, [
      id,
      postId,
      userId,
      content,
      createdAt,
    ]);

    return {
      id,
      content,
      createdAt,
      userId,
    };
  }

  async removeCommentById(id: string) {
    const query = `DELETE FROM public."Comments"
    WHERE id=$1;`;
    try {
      const result = await this.dataSource.query(query, [id]);
      return result[1] === 1;
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async clearData() {
    await this.dataSource.query(`TRUNCATE TABLE "Comments" CASCADE;`, []);
  }
}
