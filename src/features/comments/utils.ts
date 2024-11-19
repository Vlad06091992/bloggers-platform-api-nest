export const mappedCommentsToResponse = (el) => ({
  id: el.id,
  content: el.content,
  commentatorInfo: {
    userId: el.userId,
    userLogin: el.userLogin,
  },
  createdAt: el.createdAt.toISOString(),
  likesInfo: {
    likesCount: +el.likesCount,
    dislikesCount: +el.dislikesCount,
    myStatus: el.myStatus ? el.myStatus : 'None',
  },
});
