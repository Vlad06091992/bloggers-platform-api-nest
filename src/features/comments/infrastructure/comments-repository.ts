import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommentsEntity } from 'src/features/comments/entity/comments.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(CommentsEntity)
    protected repo: Repository<CommentsEntity>,
  ) {}

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

  async createComment(comment: CommentsEntity) {
    await this.repo.insert(comment);
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
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
