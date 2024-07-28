import { InjectModel } from '@nestjs/mongoose';
import { Likes, LikesModel } from 'src/features/likes/domain/likes-schema';

export class LikesQueryRepository {
  constructor(
    @InjectModel(Likes.name)
    private likesModel: LikesModel,
  ) {}

  async getLikeRecord(userId: string | null, entityId: string) {
    if (!userId) return null;

    return await this.likesModel
      .findOne({ $and: [{ userId }, { entityId }] })
      .exec();
  }

  async getNewestLikes(entityId: string) {
    return await this.likesModel
      .find(
        { entityId, likeStatus: 'Like' },
        { _id: 0, login: 1, userId: 1, addedAt: 1 },
      )
      .sort({ addedAt: -1 })
      .limit(3)
      .exec();
  }

  async getLikesCount(entityId: string) {
    return this.likesModel.countDocuments({
      entityId,
      likeStatus: 'Like',
    });
  }

  async getDislikesCount(entityId: string) {
    return this.likesModel.countDocuments({
      entityId,
      likeStatus: 'Dislike',
    });
  }
}
