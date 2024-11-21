import { Injectable } from '@nestjs/common';

import { LikeStatuses } from 'src/features/comments-reactions/api/models/like-status-dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { CommentsReactions } from 'src/features/comments-reactions/entity/comment-reactions.entity';

@Injectable()
export class CommentsLikesRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(CommentsReactions)
    protected repo: Repository<CommentsReactions>,
  ) {}
  async createLikeStatus(record: CommentsReactions) {
    await this.repo.insert(record);
  }

  async updateLikeStatus(recordId: string, likeStatus: LikeStatuses) {
    debugger;
    const record = await this.repo.findOne({ where: { id: recordId } });
    debugger;
    if (record) {
      record.likeStatus = likeStatus;
      await this.repo.save(record);
    }
  }

  async deleteRecord(id: string) {
    const result = await this.repo.delete({
      id,
    });
    return result!.affected! > 0;
  }

  async clearData() {
    const query = `TRUNCATE TABLE public."CommentsReactions"`;
    return this.dataSource.query(query, []);
  }
}
