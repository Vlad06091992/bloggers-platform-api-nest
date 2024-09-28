import { IsValidLikeStatus } from 'src/shared/validators/is-valid-like-status';

export type LikeStatuses = 'Like' | 'Dislike' | 'None';

export class LikeStatusDto {
  @IsValidLikeStatus()
  likeStatus: LikeStatuses;
}
