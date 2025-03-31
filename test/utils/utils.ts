import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import {
  CreateBlogDto,
  OutputBlog,
  UserBaseWithPassword,
  UsersObjectWithPassword,
  UsersObjectWithPasswordAndTokens,
  CreatePostDto,
  OutputPostWithLikes,
  UpdateLikeStatus,
  AllPostsWithPaginationResponse,
  CreateCommentDto,
  CreatedCommentResponse,
  PaginatedCommentsResponse,
  CommentResponse,
  CreateQuestionDto,
  PublishQuestionDto,
  OutputQuestion,
} from 'test/types/types';

export const createUser = async (
  { login, email, password },
  app: INestApplication,
) => {
  const response = await request(app.getHttpServer())
    .post('/sa/users')
    .auth('admin', 'qwerty', { type: 'basic' })
    .send({ login, email, password });

  expect(response.status).toBe(201);
  expect(response.body.id).toStrictEqual(expect.any(String));
  expect(response.body.createdAt).toStrictEqual(expect.any(String));
  expect(response.body.login).toStrictEqual(login);
  expect(response.body.email).toStrictEqual(email);
  return response.body;
};

export const loginUserInSystem = async (
  { login, password },
  app: INestApplication,
) => {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({
      loginOrEmail: login,
      password,
    })
    .set({ 'user-agent': 'jest' });
  expect(response.status).toBe(200);

  const refreshTokenInCookie = response.headers['set-cookie'][0].slice(
    'refreshToken='.length,
  );
  const accessTokenInBody = response.body.accessToken;
  return { refreshTokenInCookie, accessTokenInBody };
};

export const authMe = async (
  accessTokenInBody: string,
  app: INestApplication,
) => {
  const response = await request(app.getHttpServer())
    .get('/auth/me')
    .set('Authorization', `Bearer ${accessTokenInBody}`);
  expect(response.status).toBe(200);
  return response.body;
};

export const createUsers = async (
  { login, password },
  app: INestApplication,
  quality: number,
) => {
  const usersInfo = {};

  for (let i = 0; i < quality; i++) {
    const payload = {
      login: `${login}${i + 2}`,
      email: `email${i + 2}@mail.ru`,
      password: `${password}${i + 2}`,
    };

    const createdUser = await createUser(payload, app);
    usersInfo[`user${i + 2}`] = createdUser;
    usersInfo[`user${i + 2}`].password = payload.password;
  }

  return usersInfo;
};

export const loginUsersInSystem = async (
  users: UsersObjectWithPassword,
  app: INestApplication,
): Promise<UsersObjectWithPasswordAndTokens> => {
  const usersArr = Object.keys(users);

  const usersWithTokens: UsersObjectWithPasswordAndTokens = {};

  for (let i = 0; i < usersArr.length; i++) {
    const { login, password } = users[usersArr[i]];
    const tokens = await loginUserInSystem({ login, password }, app);
    const userWithTokens: UserBaseWithPassword & {
      tokens: {
        accessTokenInBody: string;
        refreshTokenInCookie: string;
      };
    } = { ...users[usersArr[i]], tokens };
    usersWithTokens[usersArr[i]] = userWithTokens;
  }

  return usersWithTokens;
};

export const createBlogBySuperAdmin = async (
  { name, websiteUrl, description }: CreateBlogDto,
  app: INestApplication,
): Promise<OutputBlog> => {
  const response = await request(app.getHttpServer())
    .post('/sa/blogs')
    .auth('admin', 'qwerty', { type: 'basic' })
    .send({ name, websiteUrl, description });

  expect(response.status).toBe(201);
  expect(response.body.id).toStrictEqual(expect.any(String));
  expect(response.body.createdAt).toStrictEqual(expect.any(String));
  expect(response.body.name).toStrictEqual(name);
  expect(response.body.websiteUrl).toStrictEqual(websiteUrl);
  expect(response.body.description).toStrictEqual(description);
  return response.body;
};

export const createPostBySuperAdmin = async (
  { shortDescription, content, title }: CreatePostDto,
  blogId: string,
  app: INestApplication,
): Promise<OutputPostWithLikes> => {
  const response = await request(app.getHttpServer())
    .post(`/sa/blogs/${blogId}/posts`)
    .auth('admin', 'qwerty', { type: 'basic' })
    .send({ shortDescription, content, title });

  expect(response.status).toBe(201);
  expect(response.body.id).toStrictEqual(expect.any(String));
  expect(response.body.createdAt).toStrictEqual(expect.any(String));
  expect(response.body.shortDescription).toStrictEqual(shortDescription);
  expect(response.body.content).toStrictEqual(content);
  expect(response.body.title).toStrictEqual(title);
  return response.body;
};

export const setReactionOnPostByUser = async (
  { likeStatus }: UpdateLikeStatus,
  postId: string,
  app: INestApplication,
  accessToken: string,
): Promise<boolean> => {
  const response = await request(app.getHttpServer())
    .put(`/posts/${postId}/like-status`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ likeStatus });
  expect(response.status).toBe(204);
  return response.status === 204;
};

export const getPostById = async (
  postId: string,
  app: INestApplication,
  accessToken?: string,
): Promise<OutputPostWithLikes> => {
  const requestApi = request(app.getHttpServer()).get(`/posts/${postId}`);

  if (accessToken) {
    requestApi.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await requestApi;
  expect(response.status).toBe(200);
  return response.body;
};

export const getAllPostsWithPaginationAndSorting = async (
  app: INestApplication,
  accessToken?: string,
): Promise<AllPostsWithPaginationResponse> => {
  const requestApi = request(app.getHttpServer()).get(`/posts`);

  if (accessToken) {
    requestApi.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await requestApi;
  expect(response.status).toBe(200);
  return response.body;
};

export const createCommentForPostByUser = async (
  { content }: CreateCommentDto,
  postId: string,
  app: INestApplication,
  accessToken: string,
): Promise<CreatedCommentResponse> => {
  const response = await request(app.getHttpServer())
    .post(`/posts/${postId}/comments`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ content });

  expect(response.status).toBe(201);
  expect(response.body.id).toStrictEqual(expect.any(String));
  expect(response.body.createdAt).toStrictEqual(expect.any(String));
  expect(response.body.commentatorInfo.userId).toStrictEqual(
    expect.any(String),
  );
  expect(response.body.commentatorInfo.userLogin).toStrictEqual(
    expect.any(String),
  );
  expect(response.body.likesInfo.likesCount).toBe(0);
  expect(response.body.likesInfo.dislikesCount).toBe(0);
  expect(response.body.likesInfo.myStatus).toBe('None');
  expect(response.body.content).toStrictEqual(content);

  return response.body;
};

export const getCommentsForPostByUser = async (
  postId: string,
  app: INestApplication,
  accessToken?: string,
): Promise<PaginatedCommentsResponse> => {
  const requestApi = request(app.getHttpServer()).get(
    `/posts/${postId}/comments`,
  );

  if (accessToken) {
    requestApi.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await requestApi;

  expect(response.status).toBe(200);

  expect(response.body.pagesCount).toStrictEqual(expect.any(Number));
  expect(response.body.page).toStrictEqual(expect.any(Number));
  expect(response.body.pageSize).toStrictEqual(expect.any(Number));
  expect(response.body.totalCount).toStrictEqual(expect.any(Number));
  expect(response.body.items).toStrictEqual(expect.any(Array));
  expect(response.status).toBe(200);
  return response.body;
};

export const setReactionOnCommentByUser = async (
  { likeStatus }: UpdateLikeStatus,
  commentId: string,
  app: INestApplication,
  accessToken: string,
): Promise<boolean> => {
  const response = await request(app.getHttpServer())
    .put(`/comments/${commentId}/like-status`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ likeStatus });
  expect(response.status).toBe(204);
  return response.status === 204;
};

export const getCommentById = async (
  commentId: string,
  app: INestApplication,
  accessToken?: string,
): Promise<CommentResponse> => {
  const requestApi = request(app.getHttpServer()).get(`/comments/${commentId}`);

  if (accessToken) {
    requestApi.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await requestApi;

  expect(response.status).toBe(200);

  return response.body;
};

export const createQuestionBySuperAdmin = async (
  { body, correctAnswers }: CreateQuestionDto,
  app: INestApplication,
): Promise<OutputQuestion> => {
  const response = await request(app.getHttpServer())
    .post('/sa/quiz/questions')
    .auth('admin', 'qwerty', { type: 'basic' })
    .send({ body, correctAnswers });

  expect(response.status).toBe(201);
  expect(response.body.id).toStrictEqual(expect.any(String));
  expect(response.body.createdAt).toStrictEqual(expect.any(String));
  return response.body;
};

export const publishQuestionBySuperAdmin = async (
  { published, id }: PublishQuestionDto,
  app: INestApplication,
): Promise<void> => {
  const response = await request(app.getHttpServer())
    .put(`/sa/quiz/questions/${id}/publish`)
    .auth('admin', 'qwerty', { type: 'basic' })
    .send({ published });

  expect(response.status).toBe(204);
};

export const createAndPublishQuesations = async (
  { login, password },
  app: INestApplication,
  quality: number,
) => {
  const usersInfo = {};

  for (let i = 0; i < quality; i++) {
    const payload = {
      login: `${login}${i + 2}`,
      email: `email${i + 2}@mail.ru`,
      password: `${password}${i + 2}`,
    };

    const createdUser = await createUser(payload, app);
    usersInfo[`user${i + 2}`] = createdUser;
    usersInfo[`user${i + 2}`].password = payload.password;
  }

  return usersInfo;
};

export const createAndPublishQuestions = async (
  questions: CreateQuestionDto[],
  app: INestApplication,
) => {
  const usersInfo = {};

  const questionsIds: string[] = [];

  for (let i = 0; i < questions.length; i++) {
    const result = await createQuestionBySuperAdmin(questions[i], app);
    questionsIds.push(result.id);
  }

  for (let i = 0; i < questionsIds.length; i++) {
    await publishQuestionBySuperAdmin(
      { published: true, id: questionsIds[i] },
      app,
    );
  }

  return usersInfo;
};

export const connectUserToGame = async (
  user,
  app: INestApplication,
): Promise<any> => {
  const response = await request(app.getHttpServer())
    .post('/pair-game-quiz/pairs/connection')
    .set('Authorization', `Bearer ${user.tokens.accessTokenInBody}`);
  return response.body;
};

export const answerUserToQuestion = async (
  user,
  answer,
  app: INestApplication,
): Promise<any> => {
  const response = await request(app.getHttpServer())
    .post('/pair-game-quiz/pairs/my-current/answers')
    .set('Authorization', `Bearer ${user.tokens.accessTokenInBody}`)
    .send({ answer });

  return response.body;
};
