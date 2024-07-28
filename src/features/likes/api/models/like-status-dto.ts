import { IsValidLikeStatus } from 'src/shared/validators/is-valid-like-status';

// export enum LikeStatuses {
//   Like = 'Like',
//   Dislike = 'Dislike',
//   None = 'None',
// }

export type LikeStatuses = 'Like' | 'Dislike' | 'None';

export class LikeStatusDto {
  @IsValidLikeStatus()
  likeStatus: LikeStatuses;
}
