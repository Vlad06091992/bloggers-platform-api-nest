import { Injectable } from '@nestjs/common';
import { UpdateBlogDto } from 'src/features/blogs/api/models/update-blog.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BlogsEntity } from 'src/features/blogs/entity/blogs.entity';

//only query builder

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(BlogsEntity)
    private readonly repo: Repository<BlogsEntity>,
  ) {}

  async createBlog(blog: BlogsEntity) {
    const { createdAt, name, id, isMembership, websiteUrl, description } = blog;
    await this.repo.createQueryBuilder().insert().values(blog).execute();
    return { createdAt, name, id, isMembership, websiteUrl, description };
  }

  async updateBlog(id: string, blog: UpdateBlogDto) {
    const result = await this.repo
      .createQueryBuilder()
      .update()
      .set(blog)
      .where('id = :id', { id })
      .execute();
    return result!.affected! > 0;
  }

  async removeBlogById(id: string) {
    const result = await this.repo
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
    return result!.affected! > 0;
  }

  async clearData() {
    await this.dataSource.query(`TRUNCATE TABLE public."Blogs" CASCADE;`, []);
    // await this.dataSource.query(`TRUNCATE TABLE public."Posts";`, []);
    // await this.dataSource.query(`TRUNCATE TABLE public."PostsReactions";`, []);
  }
}
