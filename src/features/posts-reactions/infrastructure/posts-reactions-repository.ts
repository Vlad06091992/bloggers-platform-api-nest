import { Injectable } from '@nestjs/common';

import { LikeStatuses } from 'src/features/comments-reactions/api/models/like-status-dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostsReactions } from 'src/features/posts-reactions/entity/post-reactions.entity';

@Injectable()
export class PostsReactionsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(PostsReactions)
    protected repo: Repository<PostsReactions>,
  ) {}

  async createLikeStatus(record: PostsReactions) {
    await this.repo.createQueryBuilder('pr').insert().values(record).execute();
  }

  async updateLikeStatus(
    postId: string,
    userId: string,
    likeStatus: LikeStatuses,
  ) {
    const reaction = await this.repo.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });

    if (reaction) {
      reaction.likeStatus = likeStatus;
      await this.repo.save(reaction);
    }
  }

  async deleteRecord(id: string) {
    const result = await this.repo.delete(id);

    // const query = `DELETE FROM public."PostsReactions"
    //      WHERE "id" = $1`;
    // const result = await this.dataSource.query(query, [id]);
    // return result[1] == 1;
  }

  async clearData() {
    const query = `TRUNCATE TABLE public."PostsReactions"`;
    return this.dataSource.query(query, []);
  }
}
