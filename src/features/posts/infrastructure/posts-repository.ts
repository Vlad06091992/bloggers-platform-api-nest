import { Injectable, NotFoundException } from '@nestjs/common';

import { UpdatePostDto } from 'src/features/posts/api/models/update-post.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Posts } from 'src/features/posts/entity/posts';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Posts) protected repo: Repository<Posts>,
  ) {}

  async createPost(post: Posts) {
    const { createdAt, content, shortDescription, id, title, blogName, blog } =
      post;
    const { id: blogId } = blog;

    await this.repo.insert(post);
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

  async updatePost(
    id: string,
    { content, shortDescription, title }: UpdatePostDto,
  ) {
    const post = await this.repo.findOne({ where: { id } });

    if (post) {
      post.content = content;
      post.shortDescription = shortDescription;
      post.title = title;
      await this.repo.save(post);
      return true;
    } else {
      return false;
    }
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
