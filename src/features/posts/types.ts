export interface OriginalPost {
  title: string;
  id: string;
  shortdescription: string;
  content: string;
  blogid: string;
  blogname: string;
  createdat: Date;
  newestLikes: OriginalLike[];
  likesCount: string;
  dislikesCount: string;
  myStatus: string;
}

export interface OriginalLike {
  login: string;
  userId: string;
  addedAt: string;
}

export interface TransformedPost {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfo;
}

export interface ExtendedLikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: Like[];
}

export interface Like {
  addedAt: string;
  userId: string;
  login: string;
}
