import { Injectable } from '@nestjs/common';
import { RequiredParamsValuesForBlogs } from 'src/shared/common-types';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Blogs } from 'src/features/blogs/entity/blogs';

//only query builder

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Blogs) protected repo: Repository<Blogs>,
  ) {}

  async getBlogById(id: string) {
    return this.repo.createQueryBuilder('b').where('b.id = :id', { id });
  }

  async findAll(params: RequiredParamsValuesForBlogs) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      params;

    const totalCount = await this.repo
      .createQueryBuilder('b')
      .where(`b.name Ilike :searchNameTerm`, {
        searchNameTerm: `%${searchNameTerm}%`,
      })
      .getCount();

    const skip = (+pageNumber - 1) * +pageSize;

    const blogs = await this.repo
      .createQueryBuilder('b')
      .select([
        'b.id',
        'b.name',
        'b.description',
        'b.websiteUrl',
        'b.createdAt',
        'b.isMembership',
      ])
      .where(`b.name Ilike :searchNameTerm`, {
        searchNameTerm: `%${searchNameTerm}%`,
      })
      .orderBy(`b.${sortBy}`, sortDirection)
      .skip(+skip)
      .take(+pageSize)
      .getMany();

    return {
      pagesCount: Math.ceil(+totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: blogs,
    };
  }

  getBlogNameById(id: string) {
    return this.repo
      .createQueryBuilder('b')
      .select(['u.name'])
      .where('b.id = :id', { id });
  }
}
