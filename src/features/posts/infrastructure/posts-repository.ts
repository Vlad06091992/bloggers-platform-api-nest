import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from 'src/features/posts/domain/posts-schema';
import { UpdatePostDto } from 'src/features/posts/api/models/update-post.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createPost(post: Post) {
    const {
      createdAt,
      content,
      shortDescription,
      id,
      title,
      blogName,
      blogId,
    } = post;
    const createPostQuery = `INSERT INTO public."Posts"(
      "id", "title", "shortDescription", "content", "blogId", "createdAt","blogName")
    VALUES ($1, $2, $3, $4, $5, $6,$7)`;

    await this.dataSource.query(createPostQuery, [
      id,
      title,
      shortDescription,
      content,
      blogId,
      createdAt,
      blogName,
    ]);

    return {
      id,
      title,
      shortDescription,
      content,
      blogId,
      blogName,
      createdAt,
    };
  }

  async updatePost(id: string, post: UpdatePostDto) {
    const { title, shortDescription, content } = post;

    const updateUserQuery = `UPDATE public."Posts"
    SET title=$2, "shortDescription"=$3, content=$4
    WHERE "id" = $1;`;
    const result = await this.dataSource.query(updateUserQuery, [
      id,
      title,
      shortDescription,
      content,
    ]);
    return (result[1] = 1);
  }

  async removePostById(id: string) {
    const query = `DELETE FROM public."Posts"
    WHERE id=$1;`;
    try {
      const result = await this.dataSource.query(query, [id]);
      return result[1] === 1;
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async clearData() {
    await this.dataSource.query(`TRUNCATE TABLE public."Posts" CASCADE;`, []);
    await this.dataSource.query(`TRUNCATE TABLE public."PostsReactions";`, []);
  }
}
