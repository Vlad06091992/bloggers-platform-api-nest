import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { writeFile } from 'fs/promises';
import { applyAppSettings } from 'src/settings/apply-app-settings';
import {
  authMe,
  createBlogBySuperAdmin,
  createCommentForPostByUser,
  createPostBySuperAdmin,
  createUser,
  createUsers,
  getAllPostsWithPaginationAndSorting,
  getCommentById,
  getCommentsForPostByUser,
  getPostById,
  loginUserInSystem,
  loginUsersInSystem,
  setReactionOnCommentByUser,
  setReactionOnPostByUser,
} from './utils/utils';

jest.setTimeout(120000);

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    applyAppSettings(app);
    await app.init();

    await request(app.getHttpServer()).delete('/testing/all-data');

    async function clearFile() {
      try {
        await writeFile('postid.txt', '', 'utf8'); // Записываем пустую строку в файл
        console.log('Файл успешно очищен.');
      } catch (err) {
        console.error('Произошла ошибка при очистке файла:', err);
      }
    }

    // Вызов функции
    await clearFile();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  const createUserDto = {
    login: 'user',
    password: 'qwerty',
    email: 'vlad1@mail.ru',
  };

  // it('create user by super admin and login in system', async () => {
  //   const createdUser = await createUser(createUserDto, app);
  //
  //   const tokens = await loginUserInSystem(
  //     {
  //       login: createdUser.login,
  //       password: createUserDto.password,
  //     },
  //     app,
  //   );
  //
  //   const userInfo = await authMe(tokens.accessTokenInBody, app);
  //
  //   expect(createdUser.id).toBe(userInfo.userId);
  //   expect(createdUser.login).toBe(userInfo.login);
  //   expect(createdUser.email).toBe(userInfo.email);
  // });

  it('posts/likes', async () => {
    const createdUsers = await createUsers(createUserDto, app, 10);
    const loginedUsers = await loginUsersInSystem(createdUsers, app);

    const blogData = {
      name: 'blog3',
      websiteUrl: 'https://vk.com/julianna_mo',
      description: 'description',
    };

    const postData = {
      title: 'title',
      websiteUrl: '//m.vk.com@rjr',
      shortDescription: 'description',
      content: 'content',
    };

    const postData2 = {
      title: 'title2',
      websiteUrl: '//m.vk.com@rjr',
      shortDescription: 'description2',
      content: 'content2',
    };

    const postData3 = {
      title: 'title3',
      websiteUrl: '//m.vk.com@rjr',
      shortDescription: 'description3',
      content: 'content3',
    };

    const postData4 = {
      title: 'title4',
      websiteUrl: '//m.vk.com@rjr',
      shortDescription: 'description4',
      content: 'content4',
    };

    const postData5 = {
      title: 'title555555555',
      websiteUrl: '//m.vk.com@url5',
      shortDescription: 'description5',
      content: 'content5',
    };

    const postData6 = {
      title: 'title6',
      websiteUrl: '//m.vk.com@url6',
      shortDescription: 'description6',
      content: 'content6',
    };

    const postData7 = {
      title: 'title7',
      websiteUrl: '//m.vk.com@url7',
      shortDescription: 'description7',
      content: 'content7',
    };

    const postData8 = {
      title: 'title8',
      websiteUrl: '//m.vk.com@url8',
      shortDescription: 'description8',
      content: 'content8',
    };

    const postData9 = {
      title: 'title9',
      websiteUrl: '//m.vk.com@url9',
      shortDescription: 'description9',
      content: 'content9',
    };

    const postData10 = {
      title: 'title10',
      websiteUrl: '//m.vk.com@url10',
      shortDescription: 'description10',
      content: 'content10',
    };

    const blog = await createBlogBySuperAdmin(blogData, app);

    const post1 = await createPostBySuperAdmin(postData, blog.id, app);
    const post2 = await createPostBySuperAdmin(postData2, blog.id, app);
    const post3 = await createPostBySuperAdmin(postData3, blog.id, app);
    const post4 = await createPostBySuperAdmin(postData4, blog.id, app);
    const post5 = await createPostBySuperAdmin(postData5, blog.id, app);
    const post6 = await createPostBySuperAdmin(postData6, blog.id, app);
    const post7 = await createPostBySuperAdmin(postData7, blog.id, app);
    const post8 = await createPostBySuperAdmin(postData8, blog.id, app);
    const post9 = await createPostBySuperAdmin(postData9, blog.id, app);
    const post10 = await createPostBySuperAdmin(postData10, blog.id, app);

    const user2 = loginedUsers['user2'];
    const user3 = loginedUsers['user3'];
    const user4 = loginedUsers['user4'];
    const user5 = loginedUsers['user5'];
    const user6 = loginedUsers['user6'];

    await setReactionOnPostByUser(
      { likeStatus: 'Like' },
      post1.id,
      app,
      user2.tokens.accessTokenInBody,
    );

    await setReactionOnPostByUser(
      { likeStatus: 'Like' },
      post2.id,
      app,
      user2.tokens.accessTokenInBody,
    );

    await setReactionOnPostByUser(
      { likeStatus: 'Like' },
      post3.id,
      app,
      user2.tokens.accessTokenInBody,
    );

    await setReactionOnPostByUser(
      { likeStatus: 'Like' },
      post4.id,
      app,
      user2.tokens.accessTokenInBody,
    );

    await setReactionOnPostByUser(
      { likeStatus: 'Like' },
      post5.id,
      app,
      user2.tokens.accessTokenInBody,
    );

    //user 3 liked post 1,2,3,4,5
    await setReactionOnPostByUser(
      { likeStatus: 'Like' },
      post1.id,
      app,
      user3.tokens.accessTokenInBody,
    );

    await setReactionOnPostByUser(
      { likeStatus: 'Like' },
      post2.id,
      app,
      user3.tokens.accessTokenInBody,
    );

    await setReactionOnPostByUser(
      { likeStatus: 'Like' },
      post3.id,
      app,
      user3.tokens.accessTokenInBody,
    );

    await setReactionOnPostByUser(
      { likeStatus: 'Like' },
      post4.id,
      app,
      user3.tokens.accessTokenInBody,
    );

    await setReactionOnPostByUser(
      { likeStatus: 'Like' },
      post5.id,
      app,
      user3.tokens.accessTokenInBody,
    );

    //user 4 liked post 1,2,3,4,5

    await setReactionOnPostByUser(
      { likeStatus: 'Like' },
      post1.id,
      app,
      user4.tokens.accessTokenInBody,
    );

    await setReactionOnPostByUser(
      { likeStatus: 'Like' },
      post2.id,
      app,
      user4.tokens.accessTokenInBody,
    );

    await setReactionOnPostByUser(
      { likeStatus: 'Like' },
      post3.id,
      app,
      user4.tokens.accessTokenInBody,
    );

    await setReactionOnPostByUser(
      { likeStatus: 'Like' },
      post4.id,
      app,
      user4.tokens.accessTokenInBody,
    );

    await setReactionOnPostByUser(
      { likeStatus: 'Like' },
      post5.id,
      app,
      user4.tokens.accessTokenInBody,
    );

    //user 4 disliked post 1

    await setReactionOnPostByUser(
      { likeStatus: 'Dislike' },
      post5.id,
      app,
      user4.tokens.accessTokenInBody,
    );

    //user 5 liked post 1,2,3,4,5

    await setReactionOnPostByUser(
      { likeStatus: 'Like' },
      post1.id,
      app,
      user5.tokens.accessTokenInBody,
    );

    await setReactionOnPostByUser(
      { likeStatus: 'Like' },
      post2.id,
      app,
      user5.tokens.accessTokenInBody,
    );

    await setReactionOnPostByUser(
      { likeStatus: 'Like' },
      post3.id,
      app,
      user5.tokens.accessTokenInBody,
    );

    await setReactionOnPostByUser(
      { likeStatus: 'Like' },
      post4.id,
      app,
      user5.tokens.accessTokenInBody,
    );

    await setReactionOnPostByUser(
      { likeStatus: 'Like' },
      post5.id,
      app,
      user5.tokens.accessTokenInBody,
    );

    //user 5 requested post1

    const post1WithReactions = await getPostById(
      post1.id,
      app,
      user5.tokens.accessTokenInBody,
    );

    expect(post1WithReactions.extendedLikesInfo.likesCount).toBe(4);
    expect(post1WithReactions.extendedLikesInfo.dislikesCount).toBe(0);
    expect(post1WithReactions.extendedLikesInfo.myStatus).toBe('Like');

    const allPostsResponse = await getAllPostsWithPaginationAndSorting(
      app,
      user5.tokens.accessTokenInBody,
    );

    expect(allPostsResponse.pagesCount).toBe(1);
    expect(allPostsResponse.items.length).toBe(10);
    expect(allPostsResponse.totalCount).toBe(10);

    //user 5 created comment for post1
    const createdComment1 = await createCommentForPostByUser(
      { content: 'user5 commented post1' },
      post1.id,
      app,
      user5.tokens.accessTokenInBody,
    );

    expect(createdComment1.content).toBe('user5 commented post1');

    //user 4 created comment for post1
    const createdComment2 = await createCommentForPostByUser(
      { content: 'user4 commented post1' },
      post1.id,
      app,
      user4.tokens.accessTokenInBody,
    );

    expect(createdComment2.content).toBe('user4 commented post1');

    //user 3 created comment for post3
    const createdComment3 = await createCommentForPostByUser(
      { content: 'user3 commented post3' },
      post3.id,
      app,
      user3.tokens.accessTokenInBody,
    );

    expect(createdComment3.content).toBe('user3 commented post3');

    //user 2 created comment for post4
    const createdComment4 = await createCommentForPostByUser(
      { content: 'user2 commented post4_1' },
      post4.id,
      app,
      user2.tokens.accessTokenInBody,
    );

    //user 2 created comment for post4
    const createdComment41 = await createCommentForPostByUser(
      { content: 'user2 commented post4_2' },
      post4.id,
      app,
      user2.tokens.accessTokenInBody,
    );
    //user 2 created comment for post4
    const createdComment43 = await createCommentForPostByUser(
      { content: 'user2 commented post4_3' },
      post4.id,
      app,
      user2.tokens.accessTokenInBody,
    );

    //user 3 created comment for post4
    const createdComment44 = await createCommentForPostByUser(
      { content: 'user3 commented post4_4' },
      post4.id,
      app,
      user3.tokens.accessTokenInBody,
    );

    //user 3 created comment for post4
    const createdComment45 = await createCommentForPostByUser(
      { content: 'user3 commented post4_5' },
      post4.id,
      app,
      user3.tokens.accessTokenInBody,
    );

    //user 3 created comment for post4
    const createdComment46 = await createCommentForPostByUser(
      { content: 'user3 commented post4_6' },
      post4.id,
      app,
      user3.tokens.accessTokenInBody,
    );

    //user 3 created comment for post4
    const createdComment47 = await createCommentForPostByUser(
      { content: 'user3 commented post4_7' },
      post4.id,
      app,
      user3.tokens.accessTokenInBody,
    );

    //user 4 created comment for post4
    const createdComment48 = await createCommentForPostByUser(
      { content: 'user4 commented post4_8' },
      post4.id,
      app,
      user4.tokens.accessTokenInBody,
    );

    //user 4 created comment for post4
    const createdComment49 = await createCommentForPostByUser(
      { content: 'user4 commented post4_9' },
      post4.id,
      app,
      user4.tokens.accessTokenInBody,
    );

    //user 4 created comment for post4
    const createdComment410 = await createCommentForPostByUser(
      { content: 'user4 commented post4_10' },
      post4.id,
      app,
      user4.tokens.accessTokenInBody,
    );

    //user 4 created comment for post4
    const createdComment411 = await createCommentForPostByUser(
      { content: 'user4 commented post4_11' },
      post4.id,
      app,
      user4.tokens.accessTokenInBody,
    );

    //user 5 created comment for post4
    const createdComment412 = await createCommentForPostByUser(
      { content: 'user4 commented post4_12' },
      post4.id,
      app,
      user5.tokens.accessTokenInBody,
    );

    // Данные, которые вы хотите записать в файл
    const postDataRec = `пост с 12 комментариями: ${post4.id}`;

    // Асинхронная функция для записи данных
    async function writeToFile(data) {
      try {
        await writeFile('postid.txt', data, 'utf8');
        console.log('Данные успешно записаны в файл.');
      } catch (err) {
        console.error('Произошла ошибка при записи в файл:', err);
      }
    }

    // Вызов функции
    await writeToFile(postDataRec);

    expect(createdComment4.content).toBe('user2 commented post4_1');

    //user 2 created comment for post5
    const createdComment5 = await createCommentForPostByUser(
      { content: 'user2 commented post5' },
      post5.id,
      app,
      user2.tokens.accessTokenInBody,
    );

    expect(createdComment5.content).toBe('user2 commented post5');

    //user4 get comments for post1

    const commentsResponse = await getCommentsForPostByUser(
      post1.id,
      app,
      user4.tokens.accessTokenInBody,
    );

    expect(commentsResponse.page).toBe(1);
    expect(commentsResponse.items.length).toBe(2);
    expect(commentsResponse.pagesCount).toBe(1);
    expect(commentsResponse.totalCount).toBe(2);

    expect(commentsResponse.items[0].commentatorInfo.userLogin).toBe(
      user4.login,
    );

    expect(commentsResponse.items[0].likesInfo.likesCount).toBe(0);
    expect(commentsResponse.items[0].likesInfo.dislikesCount).toBe(0);
    expect(commentsResponse.items[0].likesInfo.myStatus).toBe('None');
    expect(commentsResponse.items[1].commentatorInfo.userLogin).toBe(
      user5.login,
    );

    //user2 liked comments3

    await setReactionOnCommentByUser(
      { likeStatus: 'Like' },
      createdComment3.id,
      app,
      user2.tokens.accessTokenInBody,
    );

    //user3 liked comments3

    await setReactionOnCommentByUser(
      { likeStatus: 'Like' },
      createdComment3.id,
      app,
      user3.tokens.accessTokenInBody,
    );

    //user4 liked comments3

    await setReactionOnCommentByUser(
      { likeStatus: 'Like' },
      createdComment3.id,
      app,
      user4.tokens.accessTokenInBody,
    );

    const userData = `токен юзера 4: ${user4.tokens.accessTokenInBody} 
   он лайкнул коммент: ${createdComment3.id}`;

    await writeToFile(userData);

    //user5 disliked comments3

    await setReactionOnCommentByUser(
      { likeStatus: 'Dislike' },
      createdComment3.id,
      app,
      user5.tokens.accessTokenInBody,
    );

    //user5 get comments3

    const commentInfo1 = await getCommentById(
      createdComment3.id,
      app,
      user5.tokens.accessTokenInBody,
    );

    expect(commentInfo1.content).toBe('user3 commented post3');
    expect(commentInfo1.commentatorInfo.userId).toBe(user3.id);
    expect(commentInfo1.commentatorInfo.userLogin).toBe(user3.login);
    expect(commentInfo1.likesInfo.likesCount).toBe(3);
    expect(commentInfo1.likesInfo.dislikesCount).toBe(1);
    expect(commentInfo1.likesInfo.myStatus).toBe('Dislike');

    //user2 get comments3

    const commentInfo2 = await getCommentById(
      createdComment3.id,
      app,
      user2.tokens.accessTokenInBody,
    );

    expect(commentInfo2.content).toBe('user3 commented post3');
    expect(commentInfo2.commentatorInfo.userId).toBe(user3.id);
    expect(commentInfo2.commentatorInfo.userLogin).toBe(user3.login);
    expect(commentInfo2.likesInfo.likesCount).toBe(3);
    expect(commentInfo2.likesInfo.dislikesCount).toBe(1);
    expect(commentInfo2.likesInfo.myStatus).toBe('Like');

    //user6 get comments3

    const commentInfo3 = await getCommentById(
      createdComment3.id,
      app,
      user6.tokens.accessTokenInBody,
    );
    expect(commentInfo3.likesInfo.myStatus).toBe('None');
  });
});
