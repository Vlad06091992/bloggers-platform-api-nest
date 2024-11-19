import { OriginalPost, TransformedPost } from 'src/features/posts/types';

export function transformPost(original: OriginalPost): TransformedPost {
  return {
    id: original.id,
    title: original.title,
    shortDescription: original.shortdescription,
    content: original.content,
    blogId: original.blogid,
    blogName: original.blogname,
    createdAt: original.createdat.toISOString(),
    extendedLikesInfo: {
      likesCount: parseInt(original.likesCount, 10),
      dislikesCount: parseInt(original.dislikesCount, 10),
      myStatus: original.myStatus != null ? original.myStatus : 'None',
      newestLikes: original.newestLikes.map((like) => ({
        addedAt: like.addedAt,
        userId: like.userId,
        login: like.login,
      })),
    },
  };
}
