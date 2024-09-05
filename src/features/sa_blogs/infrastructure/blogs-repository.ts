import { Injectable, NotFoundException } from '@nestjs/common';
import { Blog } from 'src/features/sa_blogs/domain/blogs-schema';
import { UpdateBlogDto } from 'src/features/sa_blogs/api/models/update-blog.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createBlog(blog: Blog) {
    const { createdAt, name, id, isMembership, websiteUrl, description } = blog;

    const createUserQuery = `INSERT INTO public."Blogs"(
    id, name, description, "websiteUrl", "createdAt", "isMembership")
    VALUES ($1, $2, $3, $4, $5, $6);`;
    await this.dataSource.query(createUserQuery, [
      id,
      name,
      description,
      websiteUrl,
      createdAt,
      isMembership,
    ]);

    return { createdAt, name, id, isMembership, websiteUrl, description };
  }

  async updateBlog(id: string, blog: UpdateBlogDto) {
    const { name, websiteUrl, description } = blog;

    const createUserQuery = `UPDATE public."Blogs"
    SET name=$2, description=$3, "websiteUrl"=$4
    WHERE "id"=$1`;
    const result = await this.dataSource.query(createUserQuery, [
      id,
      name,
      description,
      websiteUrl,
    ]);

    return result[1] === 1;
  }

  async removeBlogById(id: string) {
    const query = `DELETE FROM public."Blogs"
    WHERE id=$1;`;
    try {
      const result = await this.dataSource.query(query, [id]);
      return result[1] == 1;
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async clearData() {
    await this.dataSource.query(`TRUNCATE TABLE public."Blogs" CASCADE;`, []);
    await this.dataSource.query(`TRUNCATE TABLE public."Posts";`, []);
    await this.dataSource.query(`TRUNCATE TABLE public."PostsReactions";`, []);
  }
}
