import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Likes, LikesModel } from 'src/features/likes/domain/likes-schema';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectModel(Likes.name)
    private likesModel: LikesModel,
  ) {}
  async createLikeStatus(record: Likes) {
    debugger;
    return (await this.likesModel.create(record)).toObject();
  }

  async deleteRecord(id: string) {
    const res = await this.likesModel.deleteOne({ id }).exec();
    return res.deletedCount === 1;
  }

  async clearData() {
    await this.likesModel.deleteMany({});
  }
}
