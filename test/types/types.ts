export type UserBase = {
  id: string;
  email: string;
  login: string;
  createdAt: string;
};

export type UserBaseWithPassword = UserBase & { password: string };

export type UsersObjectWithPassword = {
  [name: string]: UserBaseWithPassword;
};

export type UsersObjectWithPasswordAndTokens = {
  [name: string]: UserBaseWithPassword & {
    tokens: {
      accessTokenInBody: string;
      refreshTokenInCookie: string;
    };
  };
};

export type CreateBlogDto = {
  name: string;
  websiteUrl: string;
  description: string;
};

export type OutputBlog = {
  createdAt: string;
  name: string;
  id: string;
  isMembership: boolean;
  websiteUrl: string;
  description: string;
};

export type CreatePostDto = {
  title: string;
  shortDescription: string;
  content: string;
};

export type NewestLikes = {
  addedAt: string;
  userId: string;
  login: string;
};

export type ExtendedLikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: NewestLikes[];
};

export type OutputPostWithLikes = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string; // Можно использовать тип Date, если необходимо
  extendedLikesInfo: ExtendedLikesInfo;
};

export type LikeStatus = 'None' | 'Like' | 'Dislike';

export type UpdateLikeStatus = {
  likeStatus: LikeStatus;
};

export interface AllPostsWithPaginationResponse {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogPost[];
}

export interface BlogPost {
  title: string;
  id: string;
  shortdescription: string;
  content: string;
  blogid: string;
  blogname: string;
  createdat: string;
  newestLikes: NewestLikes[];
  likesCount: string;
  dislikesCount: string;
  myStatus: string;
}

export type CreateCommentDto = {
  content: string;
};

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export type LikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: 'None' | 'Liked' | 'Disliked';
};

export type CreatedCommentResponse = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
  likesInfo: LikesInfo;
};

export type CommentResponse = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
  likesInfo: LikesInfo;
};

export type PaginatedCommentsResponse = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentResponse[];
};
