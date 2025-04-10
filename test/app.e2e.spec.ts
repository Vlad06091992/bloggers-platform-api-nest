import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import request from 'supertest';
import {AppModule} from 'src/app.module';
import {writeFile} from 'fs/promises';
import {applyAppSettings} from 'src/settings/apply-app-settings';
import {
    answerUserToQuestion,
    connectUserToGame,
    createAndPublishQuestions,
    createBlogBySuperAdmin,
    createCommentForPostByUser,
    createPostBySuperAdmin,
    createUsers,
    getAllPostsWithPaginationAndSorting,
    getCommentById,
    getCommentsForPostByUser,
    getPostById,
    loginUsersInSystem,
    setReactionOnCommentByUser,
    setReactionOnPostByUser,
} from './utils/utils';

jest.setTimeout(120000);

// describe('AppController (e2e)', () => {
//   let app: INestApplication;
//
//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();
//
//     app = moduleFixture.createNestApplication();
//     applyAppSettings(app);
//     await app.init();
//
//     await request(app.getHttpServer()).delete('/testing/all-data');
//
//     async function clearFile() {
//       try {
//         await writeFile('postid.txt', '', 'utf8'); // Записываем пустую строку в файл
//         console.log('Файл успешно очищен.');
//       } catch (err) {
//         console.error('Произошла ошибка при очистке файла:', err);
//       }
//     }
//
//     // Вызов функции
//     await clearFile();
//   });
//
//   afterAll(async () => {
//     if (app) {
//       await app.close();
//     }
//   });
//
//   const createUserDto = {
//     login: 'user',
//     password: 'qwerty',
//     email: 'vlad1@mail.ru',
//   };
//
//   // it('create user by super admin and login in system', async () => {
//   //   const createdUser = await createUser(createUserDto, app);
//   //
//   //   const tokens = await loginUserInSystem(
//   //     {
//   //       login: createdUser.login,
//   //       password: createUserDto.password,
//   //     },
//   //     app,
//   //   );
//   //
//   //   const userInfo = await authMe(tokens.accessTokenInBody, app);
//   //
//   //   expect(createdUser.id).toBe(userInfo.userId);
//   //   expect(createdUser.login).toBe(userInfo.login);
//   //   expect(createdUser.email).toBe(userInfo.email);
//   // });
//
//   it('posts/likes', async () => {
//     const createdUsers = await createUsers(createUserDto, app, 10);
//     const loginedUsers = await loginUsersInSystem(createdUsers, app);
//
//     const blogData = {
//       name: 'blog3',
//       websiteUrl: 'https://vk.com/julianna_mo',
//       description: 'description',
//     };
//
//     const postData = {
//       title: 'title',
//       websiteUrl: '//m.vk.com@rjr',
//       shortDescription: 'description',
//       content: 'content',
//     };
//
//     const postData2 = {
//       title: 'title2',
//       websiteUrl: '//m.vk.com@rjr',
//       shortDescription: 'description2',
//       content: 'content2',
//     };
//
//     const postData3 = {
//       title: 'title3',
//       websiteUrl: '//m.vk.com@rjr',
//       shortDescription: 'description3',
//       content: 'content3',
//     };
//
//     const postData4 = {
//       title: 'title4',
//       websiteUrl: '//m.vk.com@rjr',
//       shortDescription: 'description4',
//       content: 'content4',
//     };
//
//     const postData5 = {
//       title: 'title555555555',
//       websiteUrl: '//m.vk.com@url5',
//       shortDescription: 'description5',
//       content: 'content5',
//     };
//
//     const postData6 = {
//       title: 'title6',
//       websiteUrl: '//m.vk.com@url6',
//       shortDescription: 'description6',
//       content: 'content6',
//     };
//
//     const postData7 = {
//       title: 'title7',
//       websiteUrl: '//m.vk.com@url7',
//       shortDescription: 'description7',
//       content: 'content7',
//     };
//
//     const postData8 = {
//       title: 'title8',
//       websiteUrl: '//m.vk.com@url8',
//       shortDescription: 'description8',
//       content: 'content8',
//     };
//
//     const postData9 = {
//       title: 'title9',
//       websiteUrl: '//m.vk.com@url9',
//       shortDescription: 'description9',
//       content: 'content9',
//     };
//
//     const postData10 = {
//       title: 'title10',
//       websiteUrl: '//m.vk.com@url10',
//       shortDescription: 'description10',
//       content: 'content10',
//     };
//
//     const blog = await createBlogBySuperAdmin(blogData, app);
//
//     const post1 = await createPostBySuperAdmin(postData, blog.id, app);
//     const post2 = await createPostBySuperAdmin(postData2, blog.id, app);
//     const post3 = await createPostBySuperAdmin(postData3, blog.id, app);
//     const post4 = await createPostBySuperAdmin(postData4, blog.id, app);
//     const post5 = await createPostBySuperAdmin(postData5, blog.id, app);
//     const post6 = await createPostBySuperAdmin(postData6, blog.id, app);
//     const post7 = await createPostBySuperAdmin(postData7, blog.id, app);
//     const post8 = await createPostBySuperAdmin(postData8, blog.id, app);
//     const post9 = await createPostBySuperAdmin(postData9, blog.id, app);
//     const post10 = await createPostBySuperAdmin(postData10, blog.id, app);
//
//     const user2 = loginedUsers['user2'];
//     const user3 = loginedUsers['user3'];
//     const user4 = loginedUsers['user4'];
//     const user5 = loginedUsers['user5'];
//     const user6 = loginedUsers['user6'];
//
//     await setReactionOnPostByUser(
//       { likeStatus: 'Like' },
//       post1.id,
//       app,
//       user2.tokens.accessTokenInBody,
//     );
//
//     await setReactionOnPostByUser(
//       { likeStatus: 'Like' },
//       post2.id,
//       app,
//       user2.tokens.accessTokenInBody,
//     );
//
//     await setReactionOnPostByUser(
//       { likeStatus: 'Like' },
//       post3.id,
//       app,
//       user2.tokens.accessTokenInBody,
//     );
//
//     await setReactionOnPostByUser(
//       { likeStatus: 'Like' },
//       post4.id,
//       app,
//       user2.tokens.accessTokenInBody,
//     );
//
//     await setReactionOnPostByUser(
//       { likeStatus: 'Like' },
//       post5.id,
//       app,
//       user2.tokens.accessTokenInBody,
//     );
//
//     //user 3 liked post 1,2,3,4,5
//     await setReactionOnPostByUser(
//       { likeStatus: 'Like' },
//       post1.id,
//       app,
//       user3.tokens.accessTokenInBody,
//     );
//
//     await setReactionOnPostByUser(
//       { likeStatus: 'Like' },
//       post2.id,
//       app,
//       user3.tokens.accessTokenInBody,
//     );
//
//     await setReactionOnPostByUser(
//       { likeStatus: 'Like' },
//       post3.id,
//       app,
//       user3.tokens.accessTokenInBody,
//     );
//
//     await setReactionOnPostByUser(
//       { likeStatus: 'Like' },
//       post4.id,
//       app,
//       user3.tokens.accessTokenInBody,
//     );
//
//     await setReactionOnPostByUser(
//       { likeStatus: 'Like' },
//       post5.id,
//       app,
//       user3.tokens.accessTokenInBody,
//     );
//
//     //user 4 liked post 1,2,3,4,5
//
//     await setReactionOnPostByUser(
//       { likeStatus: 'Like' },
//       post1.id,
//       app,
//       user4.tokens.accessTokenInBody,
//     );
//
//     await setReactionOnPostByUser(
//       { likeStatus: 'Like' },
//       post2.id,
//       app,
//       user4.tokens.accessTokenInBody,
//     );
//
//     await setReactionOnPostByUser(
//       { likeStatus: 'Like' },
//       post3.id,
//       app,
//       user4.tokens.accessTokenInBody,
//     );
//
//     await setReactionOnPostByUser(
//       { likeStatus: 'Like' },
//       post4.id,
//       app,
//       user4.tokens.accessTokenInBody,
//     );
//
//     await setReactionOnPostByUser(
//       { likeStatus: 'Like' },
//       post5.id,
//       app,
//       user4.tokens.accessTokenInBody,
//     );
//
//     //user 4 disliked post 1
//
//     await setReactionOnPostByUser(
//       { likeStatus: 'Dislike' },
//       post5.id,
//       app,
//       user4.tokens.accessTokenInBody,
//     );
//
//     //user 5 liked post 1,2,3,4,5
//
//     await setReactionOnPostByUser(
//       { likeStatus: 'Like' },
//       post1.id,
//       app,
//       user5.tokens.accessTokenInBody,
//     );
//
//     await setReactionOnPostByUser(
//       { likeStatus: 'Like' },
//       post2.id,
//       app,
//       user5.tokens.accessTokenInBody,
//     );
//
//     await setReactionOnPostByUser(
//       { likeStatus: 'Like' },
//       post3.id,
//       app,
//       user5.tokens.accessTokenInBody,
//     );
//
//     await setReactionOnPostByUser(
//       { likeStatus: 'Like' },
//       post4.id,
//       app,
//       user5.tokens.accessTokenInBody,
//     );
//
//     await setReactionOnPostByUser(
//       { likeStatus: 'Like' },
//       post5.id,
//       app,
//       user5.tokens.accessTokenInBody,
//     );
//
//     //user 5 requested post1
//
//     const post1WithReactions = await getPostById(
//       post1.id,
//       app,
//       user5.tokens.accessTokenInBody,
//     );
//
//     expect(post1WithReactions.extendedLikesInfo.likesCount).toBe(4);
//     expect(post1WithReactions.extendedLikesInfo.dislikesCount).toBe(0);
//     expect(post1WithReactions.extendedLikesInfo.myStatus).toBe('Like');
//
//     const allPostsResponse = await getAllPostsWithPaginationAndSorting(
//       app,
//       user5.tokens.accessTokenInBody,
//     );
//
//     expect(allPostsResponse.pagesCount).toBe(1);
//     expect(allPostsResponse.items.length).toBe(10);
//     expect(allPostsResponse.totalCount).toBe(10);
//
//     //user 5 created comment for post1
//     const createdComment1 = await createCommentForPostByUser(
//       { content: 'user5 commented post1' },
//       post1.id,
//       app,
//       user5.tokens.accessTokenInBody,
//     );
//
//     expect(createdComment1.content).toBe('user5 commented post1');
//
//     //user 4 created comment for post1
//     const createdComment2 = await createCommentForPostByUser(
//       { content: 'user4 commented post1' },
//       post1.id,
//       app,
//       user4.tokens.accessTokenInBody,
//     );
//
//     expect(createdComment2.content).toBe('user4 commented post1');
//
//     //user 3 created comment for post3
//     const createdComment3 = await createCommentForPostByUser(
//       { content: 'user3 commented post3' },
//       post3.id,
//       app,
//       user3.tokens.accessTokenInBody,
//     );
//
//     expect(createdComment3.content).toBe('user3 commented post3');
//
//     //user 2 created comment for post4
//     const createdComment4 = await createCommentForPostByUser(
//       { content: 'user2 commented post4_1' },
//       post4.id,
//       app,
//       user2.tokens.accessTokenInBody,
//     );
//
//     //user 2 created comment for post4
//     const createdComment41 = await createCommentForPostByUser(
//       { content: 'user2 commented post4_2' },
//       post4.id,
//       app,
//       user2.tokens.accessTokenInBody,
//     );
//     //user 2 created comment for post4
//     const createdComment43 = await createCommentForPostByUser(
//       { content: 'user2 commented post4_3' },
//       post4.id,
//       app,
//       user2.tokens.accessTokenInBody,
//     );
//
//     //user 3 created comment for post4
//     const createdComment44 = await createCommentForPostByUser(
//       { content: 'user3 commented post4_4' },
//       post4.id,
//       app,
//       user3.tokens.accessTokenInBody,
//     );
//
//     //user 3 created comment for post4
//     const createdComment45 = await createCommentForPostByUser(
//       { content: 'user3 commented post4_5' },
//       post4.id,
//       app,
//       user3.tokens.accessTokenInBody,
//     );
//
//     //user 3 created comment for post4
//     const createdComment46 = await createCommentForPostByUser(
//       { content: 'user3 commented post4_6' },
//       post4.id,
//       app,
//       user3.tokens.accessTokenInBody,
//     );
//
//     //user 3 created comment for post4
//     const createdComment47 = await createCommentForPostByUser(
//       { content: 'user3 commented post4_7' },
//       post4.id,
//       app,
//       user3.tokens.accessTokenInBody,
//     );
//
//     //user 4 created comment for post4
//     const createdComment48 = await createCommentForPostByUser(
//       { content: 'user4 commented post4_8' },
//       post4.id,
//       app,
//       user4.tokens.accessTokenInBody,
//     );
//
//     //user 4 created comment for post4
//     const createdComment49 = await createCommentForPostByUser(
//       { content: 'user4 commented post4_9' },
//       post4.id,
//       app,
//       user4.tokens.accessTokenInBody,
//     );
//
//     //user 4 created comment for post4
//     const createdComment410 = await createCommentForPostByUser(
//       { content: 'user4 commented post4_10' },
//       post4.id,
//       app,
//       user4.tokens.accessTokenInBody,
//     );
//
//     //user 4 created comment for post4
//     const createdComment411 = await createCommentForPostByUser(
//       { content: 'user4 commented post4_11' },
//       post4.id,
//       app,
//       user4.tokens.accessTokenInBody,
//     );
//
//     //user 5 created comment for post4
//     const createdComment412 = await createCommentForPostByUser(
//       { content: 'user4 commented post4_12' },
//       post4.id,
//       app,
//       user5.tokens.accessTokenInBody,
//     );
//
//     // Данные, которые вы хотите записать в файл
//     const postDataRec = `пост с 12 комментариями: ${post4.id}`;
//
//     // Асинхронная функция для записи данных
//     async function writeToFile(data) {
//       try {
//         await writeFile('postid.txt', data, 'utf8');
//         console.log('Данные успешно записаны в файл.');
//       } catch (err) {
//         console.error('Произошла ошибка при записи в файл:', err);
//       }
//     }
//
//     // Вызов функции
//     await writeToFile(postDataRec);
//
//     expect(createdComment4.content).toBe('user2 commented post4_1');
//
//     //user 2 created comment for post5
//     const createdComment5 = await createCommentForPostByUser(
//       { content: 'user2 commented post5' },
//       post5.id,
//       app,
//       user2.tokens.accessTokenInBody,
//     );
//
//     expect(createdComment5.content).toBe('user2 commented post5');
//
//     //user4 get comments for post1
//
//     const commentsResponse = await getCommentsForPostByUser(
//       post1.id,
//       app,
//       user4.tokens.accessTokenInBody,
//     );
//
//     expect(commentsResponse.page).toBe(1);
//     expect(commentsResponse.items.length).toBe(2);
//     expect(commentsResponse.pagesCount).toBe(1);
//     expect(commentsResponse.totalCount).toBe(2);
//
//     expect(commentsResponse.items[0].commentatorInfo.userLogin).toBe(
//       user4.login,
//     );
//
//     expect(commentsResponse.items[0].likesInfo.likesCount).toBe(0);
//     expect(commentsResponse.items[0].likesInfo.dislikesCount).toBe(0);
//     expect(commentsResponse.items[0].likesInfo.myStatus).toBe('None');
//     expect(commentsResponse.items[1].commentatorInfo.userLogin).toBe(
//       user5.login,
//     );
//
//     //user2 liked comments3
//
//     await setReactionOnCommentByUser(
//       { likeStatus: 'Like' },
//       createdComment3.id,
//       app,
//       user2.tokens.accessTokenInBody,
//     );
//
//     //user3 liked comments3
//
//     await setReactionOnCommentByUser(
//       { likeStatus: 'Like' },
//       createdComment3.id,
//       app,
//       user3.tokens.accessTokenInBody,
//     );
//
//     //user4 liked comments3
//
//     await setReactionOnCommentByUser(
//       { likeStatus: 'Like' },
//       createdComment3.id,
//       app,
//       user4.tokens.accessTokenInBody,
//     );
//
//     const userData = `токен юзера 4: ${user4.tokens.accessTokenInBody}
//    он лайкнул коммент: ${createdComment3.id}`;
//
//     await writeToFile(userData);
//
//     //user5 disliked comments3
//
//     await setReactionOnCommentByUser(
//       { likeStatus: 'Dislike' },
//       createdComment3.id,
//       app,
//       user5.tokens.accessTokenInBody,
//     );
//
//     //user5 get comments3
//
//     const commentInfo1 = await getCommentById(
//       createdComment3.id,
//       app,
//       user5.tokens.accessTokenInBody,
//     );
//
//     expect(commentInfo1.content).toBe('user3 commented post3');
//     expect(commentInfo1.commentatorInfo.userId).toBe(user3.id);
//     expect(commentInfo1.commentatorInfo.userLogin).toBe(user3.login);
//     expect(commentInfo1.likesInfo.likesCount).toBe(3);
//     expect(commentInfo1.likesInfo.dislikesCount).toBe(1);
//     expect(commentInfo1.likesInfo.myStatus).toBe('Dislike');
//
//     //user2 get comments3
//
//     const commentInfo2 = await getCommentById(
//       createdComment3.id,
//       app,
//       user2.tokens.accessTokenInBody,
//     );
//
//     expect(commentInfo2.content).toBe('user3 commented post3');
//     expect(commentInfo2.commentatorInfo.userId).toBe(user3.id);
//     expect(commentInfo2.commentatorInfo.userLogin).toBe(user3.login);
//     expect(commentInfo2.likesInfo.likesCount).toBe(3);
//     expect(commentInfo2.likesInfo.dislikesCount).toBe(1);
//     expect(commentInfo2.likesInfo.myStatus).toBe('Like');
//
//     //user6 get comments3
//
//     const commentInfo3 = await getCommentById(
//       createdComment3.id,
//       app,
//       user6.tokens.accessTokenInBody,
//     );
//     expect(commentInfo3.likesInfo.myStatus).toBe('None');
//   });
// });

describe('quiz (e2e)', () => {
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

    it('data', async () => {
        const createdUsers = await createUsers(createUserDto, app, 10);
        const loginedUsers = (await loginUsersInSystem(createdUsers, app)) as any;

        // Асинхронная функция для записи данных
        async function writeToFile(data) {
            try {
                await writeFile('postid.txt', data, 'utf8');
                console.log('Данные успешно записаны в файл.');
            } catch (err) {
                console.error('Произошла ошибка при записи в файл:', err);
            }
        }

        const allQuestionsForGame = [
            {
                body: 'Какую планету называют красной планетой?',
                correctAnswers: ['Марс'],
            },
            {
                body: 'Сколько дней в неделе?',
                correctAnswers: ['7'],
            },
            {
                body: 'Как называется самый большой океан на Земле?',
                correctAnswers: ['Тихий океан'],
            },
            {
                body: 'Какая страна известна своими тюльпанами и ветряными мельницами?',
                correctAnswers: ['Нидерланды'],
            },
            {
                body: 'Какой прибор измеряет температуру?',
                correctAnswers: ['Термометр'],
            },
            {
                body: 'Какая геометрическая фигура имеет четыре равные стороны и четыре угла?',
                correctAnswers: ['Квадрат'],
            },
            {
                body: 'Как называют собрание книг, периодических изданий и других источников информации?',
                correctAnswers: ['Библиотека'],
            },
            {
                body: 'Кто написал "Войну и мир"?',
                correctAnswers: ['Лев Толстой'],
            },
            {
                body: 'Какой орган человеческого тела помимо кожи считается самым большим?',
                correctAnswers: ['Печень'],
            },
            {
                body: 'Кто первым ступил на Луну?',
                correctAnswers: ['Нил Армстронг'],
            },
            {
                body: "Какой химический элемент обозначается символом 'O'?",
                correctAnswers: ['Кислород'],
            },
            {
                body: 'Что падает осенью с деревьев в большом количестве?',
                correctAnswers: ['Листья'],
            },
            {
                body: "Каково значение 'пи' приблизительно?",
                correctAnswers: ['3.14'],
            },
            {
                body: 'Какая самая большая кошка в мире?',
                correctAnswers: ['Тигр'],
            },
            {
                body: 'Какой цвет получится, если смешать желтый и синий?',
                correctAnswers: ['Зеленый'],
            },
            {
                body: 'Какое млекопитающее способно летать?',
                correctAnswers: ['Летучая мышь'],
            },
            {
                body: 'Кто является автором картины "Мона Лиза"?',
                correctAnswers: ['Леонардо да Винчи'],
            },
            {
                body: 'Какая планета известна своими кольцами?',
                correctAnswers: ['Сатурн'],
            },
            {
                body: 'Какой металл известен как самый легкий?',
                correctAnswers: ['Литий'],
            },
            {
                body: 'Какой музыкальный инструмент является струнным и имеет смычок?',
                correctAnswers: ['Скрипка'],
            },
        ];

        function findCorrectAnswer({body}) {
            const res = allQuestionsForGame.find((el) => {
                return el.body === body;
            })?.correctAnswers[0];
            return res;
        }

        await createAndPublishQuestions(allQuestionsForGame, app);

        //первая игра юзер2/юзер3

        await connectUserToGame(loginedUsers.user2, app);
        const game1 = await connectUserToGame(loginedUsers.user3, app);

        const questions = game1.questions;
        const correctAnswer1 = findCorrectAnswer(questions[0]);

        //юзер2 отвечает корректно на первый вопрос
        await answerUserToQuestion(loginedUsers.user2, correctAnswer1, app);
        //юзер3 отвечает не корректно на первый вопрос
        await answerUserToQuestion(loginedUsers.user3, 'неправильно', app);
debugger
        const correctAnswer2 = findCorrectAnswer(questions[1]);

        //юзер2 отвечает корректно на второй вопрос
        await answerUserToQuestion(loginedUsers.user2, correctAnswer2, app);
        //юзер3 отвечает корректно на второй вопрос
        await answerUserToQuestion(loginedUsers.user3, correctAnswer2, app);
debugger
        const correctAnswer3 = findCorrectAnswer(questions[2]);

        //юзер2 отвечает корректно на третий вопрос
        await answerUserToQuestion(loginedUsers.user2, correctAnswer3, app);
        //юзер3 отвечает корректно на третий вопрос
        // await answerUserToQuestion(loginedUsers.user3, correctAnswer3, app);

        const correctAnswer4 = findCorrectAnswer(questions[3]);

        //юзер2 отвечает корректно на четвертый вопрос
        await answerUserToQuestion(loginedUsers.user2, correctAnswer4, app);
        //юзер3 отвечает корректно на четвертый вопрос
        // await answerUserToQuestion(loginedUsers.user3, correctAnswer4, app);

        const correctAnswer5 = findCorrectAnswer(questions[4]);

        //юзер2 отвечает корректно на пятый вопрос
        await answerUserToQuestion(loginedUsers.user2, correctAnswer5, app);


//     setTimeout(async ()=>{
//       debugger
//          //юзер3 отвечает корректно на пятый вопрос
//     await answerUserToQuestion(loginedUsers.user3, correctAnswer5, app);
//
//           // Данные, которые вы хотите записать в файл
//     const bearer = `bearer 1 юзера: ${loginedUsers.user2.tokens.accessTokenInBody}, \`id игры: ${game1.id}\``;
// debugger
//     // Вызов функции
//     await writeToFile(bearer);
//     // expect(1).toBe(1);
//
//     },15000)

        const promise = new Promise((resolve, reject) => {
            setTimeout(async () => {
                //юзер3 отвечает корректно на пятый вопрос
                await answerUserToQuestion(loginedUsers.user3, correctAnswer5, app);

                // Данные, которые вы хотите записать в файл
                const bearer = `bearer 1 юзера: ${loginedUsers.user2.tokens.accessTokenInBody}, \`id игры: ${game1.id}\``;
                await writeToFile(bearer);
                debugger
                resolve(true)
            }, 15000)
        })

        const res = await promise

        debugger;
        /*
            //-----------------------------------------------------------------------------
            //вторая игра юзер2/юзер4
            await connectUserToGame(loginedUsers.user4, app);
            const game2 = await connectUserToGame(loginedUsers.user2, app);
            const questions2 = game2.questions;
            const correctAnswer2_1 = findCorrectAnswer(questions[0]);

            //юзер2 отвечает корректно на первый вопрос
            await answerUserToQuestion(loginedUsers.user2, correctAnswer2_1, app);
            //юзер4 отвечает не корректно на первый вопрос
            await answerUserToQuestion(loginedUsers.user4, '', app);

            const correctAnswer2_2 = findCorrectAnswer(questions2[1]);

            //юзер2 отвечает корректно на второй вопрос
            await answerUserToQuestion(loginedUsers.user2, correctAnswer2_2, app);
            //юзер4 отвечает некорректно на второй вопрос
            await answerUserToQuestion(loginedUsers.user4, '', app);

            const correctAnswer2_3 = findCorrectAnswer(questions2[2]);

            //юзер2 отвечает корректно на третий вопрос
            await answerUserToQuestion(loginedUsers.user2, correctAnswer2_3, app);
            //юзер4 отвечает корректно на третий вопрос
            await answerUserToQuestion(loginedUsers.user4, correctAnswer2_3, app);

            const correctAnswer2_4 = findCorrectAnswer(questions2[3]);

            //юзер2 отвечает корректно на четвертый вопрос
            await answerUserToQuestion(loginedUsers.user2, correctAnswer2_4, app);
            //юзер4 отвечает корректно на четвертый вопрос
            await answerUserToQuestion(loginedUsers.user4, correctAnswer2_4, app);

            const correctAnswer2_5 = findCorrectAnswer(questions2[4]);

            //юзер2 отвечает корректно на пятый вопрос
            await answerUserToQuestion(loginedUsers.user2, correctAnswer2_5, app);
            //юзер4 отвечает корректно на пятый вопрос
            await answerUserToQuestion(loginedUsers.user4, correctAnswer2_5, app);

            debugger;

            //-----------------------------------------------------------------------------
            //третья игра юзер2/юзер5
            await connectUserToGame(loginedUsers.user5, app);
            const game3 = await connectUserToGame(loginedUsers.user2, app);
            debugger;
            const questions3 = game3.questions;
            const correctAnswer3_1 = findCorrectAnswer(questions3[0]);

            //юзер2 отвечает корректно на первый вопрос
            await answerUserToQuestion(loginedUsers.user2, correctAnswer3_1, app);
            //юзер4 отвечает не корректно на первый вопрос
            await answerUserToQuestion(loginedUsers.user5, '', app);

            const correctAnswer3_2 = findCorrectAnswer(questions3[1]);

            //юзер2 отвечает корректно на второй вопрос
            await answerUserToQuestion(loginedUsers.user2, correctAnswer3_2, app);
            //юзер4 отвечает некорректно на второй вопрос
            await answerUserToQuestion(loginedUsers.user5, '', app);

            const correctAnswer3_3 = findCorrectAnswer(questions3[2]);

            //юзер2 отвечает корректно на третий вопрос
            await answerUserToQuestion(loginedUsers.user2, correctAnswer3_3, app);
            //юзер4 отвечает корректно на третий вопрос
            await answerUserToQuestion(loginedUsers.user5, correctAnswer3_3, app);

            const correctAnswer3_4 = findCorrectAnswer(questions3[3]);

            //юзер2 отвечает корректно на четвертый вопрос
            await answerUserToQuestion(loginedUsers.user2, '', app);
            //юзер4 отвечает корректно на четвертый вопрос
            await answerUserToQuestion(loginedUsers.user5, '', app);

            const correctAnswer3_5 = findCorrectAnswer(questions3[4]);

            //юзер2 отвечает корректно на пятый вопрос
            await answerUserToQuestion(loginedUsers.user2, '', app);
            //юзер4 отвечает корректно на пятый вопрос
            await answerUserToQuestion(loginedUsers.user5, correctAnswer3_5, app);

            //-----------------------------------------------------------------------------
            //четвертая игра юзер2/юзер3
            await connectUserToGame(loginedUsers.user2, app);
            const game4 = await connectUserToGame(loginedUsers.user3, app);
            debugger;
            const questions4 = game4.questions;
            const correctAnswer4_1 = findCorrectAnswer(questions4[0]);

            //юзер2 отвечает корректно на первый вопрос
            await answerUserToQuestion(loginedUsers.user2, correctAnswer4_1, app);
            //юзер4 отвечает не корректно на первый вопрос
            await answerUserToQuestion(loginedUsers.user3, '', app);

            const correctAnswer4_2 = findCorrectAnswer(questions4[1]);

            //юзер2 отвечает корректно на второй вопрос
            await answerUserToQuestion(loginedUsers.user2, correctAnswer4_2, app);
            //юзер4 отвечает некорректно на второй вопрос
            await answerUserToQuestion(loginedUsers.user3, '', app);

            const correctAnswer4_3 = findCorrectAnswer(questions4[2]);

            //юзер2 отвечает корректно на третий вопрос
            await answerUserToQuestion(loginedUsers.user2, '', app);
            //юзер4 отвечает корректно на третий вопрос
            await answerUserToQuestion(loginedUsers.user3, correctAnswer4_3, app);

            const correctAnswer4_4 = findCorrectAnswer(questions4[3]);

            //юзер2 отвечает корректно на четвертый вопрос
            await answerUserToQuestion(loginedUsers.user2, '', app);
            //юзер4 отвечает корректно на четвертый вопрос
            await answerUserToQuestion(loginedUsers.user3, correctAnswer4_4, app);

            const correctAnswer4_5 = findCorrectAnswer(questions4[4]);

            //юзер2 отвечает корректно на пятый вопрос
            await answerUserToQuestion(loginedUsers.user2, '', app);
            //юзер4 отвечает корректно на пятый вопрос
            await answerUserToQuestion(loginedUsers.user3, correctAnswer4_5, app);

            //-----------------------------------------------------------------------------
            //пятая игра юзер2/юзер4
            await connectUserToGame(loginedUsers.user2, app);
            const game5 = await connectUserToGame(loginedUsers.user4, app);
            debugger;
            const questions5 = game5.questions;
            const correctAnswer5_1 = findCorrectAnswer(questions5[0]);

            //юзер2 отвечает корректно на первый вопрос
            await answerUserToQuestion(loginedUsers.user2, correctAnswer5_1, app);
            //юзер4 отвечает не корректно на первый вопрос
            await answerUserToQuestion(loginedUsers.user4, correctAnswer5_1, app);

            const correctAnswer5_2 = findCorrectAnswer(questions5[1]);

            //юзер2 отвечает корректно на второй вопрос
            await answerUserToQuestion(loginedUsers.user2, correctAnswer5_2, app);
            //юзер4 отвечает некорректно на второй вопрос
            await answerUserToQuestion(loginedUsers.user4, correctAnswer5_2, app);

            const correctAnswer5_3 = findCorrectAnswer(questions5[2]);

            //юзер2 отвечает корректно на третий вопрос
            await answerUserToQuestion(loginedUsers.user2, correctAnswer5_3, app);
            //юзер4 отвечает корректно на третий вопрос
            await answerUserToQuestion(loginedUsers.user4, correctAnswer5_3, app);

            const correctAnswer5_4 = findCorrectAnswer(questions5[3]);

            // юзер2 отвечает корректно на четвертый вопрос
            await answerUserToQuestion(loginedUsers.user2, correctAnswer5_4, app);
            // юзер4 отвечает корректно на четвертый вопрос
            await answerUserToQuestion(loginedUsers.user4, correctAnswer5_4, app);

            const correctAnswer5_5 = findCorrectAnswer(questions5[4]);

            //юзер2 отвечает корректно на пятый вопрос
            await answerUserToQuestion(loginedUsers.user2, correctAnswer5_5, app);
            //юзер4 отвечает корректно на пятый вопрос
            await answerUserToQuestion(loginedUsers.user4, correctAnswer5_5, app);


             //-----------------------------------------------------------------------------
            //шестая игра юзер3/юзер5
            await connectUserToGame(loginedUsers.user3, app);
            const game6 = await connectUserToGame(loginedUsers.user5, app);
            debugger;
            const questions6 = game6.questions;
            const correctAnswer6_1 = findCorrectAnswer(questions6[0]);

            //юзер3 отвечает корректно на первый вопрос
            await answerUserToQuestion(loginedUsers.user3, correctAnswer6_1, app);
            //юзер5 отвечает не корректно на первый вопрос
            await answerUserToQuestion(loginedUsers.user5, '', app);

            const correctAnswer6_2 = findCorrectAnswer(questions6[1]);

            //юзер3 отвечает корректно на второй вопрос
            await answerUserToQuestion(loginedUsers.user3, correctAnswer6_2, app);
            //юзер5 отвечает некорректно на второй вопрос
            await answerUserToQuestion(loginedUsers.user5, correctAnswer6_2, app);

            const correctAnswer6_3 = findCorrectAnswer(questions6[2]);

            //юзер3 отвечает корректно на третий вопрос
            await answerUserToQuestion(loginedUsers.user3, correctAnswer6_3, app);
            //юзер5 отвечает корректно на третий вопрос
            await answerUserToQuestion(loginedUsers.user5, correctAnswer6_3, app);

            const correctAnswer6_4 = findCorrectAnswer(questions6[3]);

            // юзер3 отвечает корректно на четвертый вопрос
            await answerUserToQuestion(loginedUsers.user3, correctAnswer6_4, app);
            // юзер5 отвечает корректно на четвертый вопрос
            await answerUserToQuestion(loginedUsers.user5, correctAnswer6_4, app);

            const correctAnswer6_5 = findCorrectAnswer(questions6[4]);

            //юзер3 отвечает корректно на пятый вопрос
            await answerUserToQuestion(loginedUsers.user3, correctAnswer6_5, app);
            //юзер5 отвечает корректно на пятый вопрос
            await answerUserToQuestion(loginedUsers.user5, correctAnswer6_5, app);


            //-----------------------------------------------------------------------------
            //седьмая игра юзер4/юзер2
            await connectUserToGame(loginedUsers.user4, app);
            const game7 = await connectUserToGame(loginedUsers.user2, app);
            debugger;
            const questions7 = game7.questions;
            const correctAnswer7_1 = findCorrectAnswer(questions7[0]);

            //юзер4 отвечает корректно на первый вопрос
            await answerUserToQuestion(loginedUsers.user4, correctAnswer7_1, app);
            //юзер2 отвечает не корректно на первый вопрос
            await answerUserToQuestion(loginedUsers.user2, '', app);

            const correctAnswer7_2 = findCorrectAnswer(questions7[1]);

            //юзер4 отвечает корректно на второй вопрос
            await answerUserToQuestion(loginedUsers.user4, correctAnswer7_2, app);
            //юзер2 отвечает некорректно на второй вопрос
            await answerUserToQuestion(loginedUsers.user2, '', app);

            const correctAnswer7_3 = findCorrectAnswer(questions7[2]);

            //юзер4 отвечает корректно на третий вопрос
            await answerUserToQuestion(loginedUsers.user4, correctAnswer7_3, app);
            //юзер2 отвечает корректно на третий вопрос
            await answerUserToQuestion(loginedUsers.user2, '', app);

            const correctAnswer7_4 = findCorrectAnswer(questions7[3]);

            // юзер4 отвечает корректно на четвертый вопрос
            await answerUserToQuestion(loginedUsers.user4, correctAnswer7_4, app);
            // юзер2 отвечает корректно на четвертый вопрос
            await answerUserToQuestion(loginedUsers.user2, correctAnswer7_4, app);

            const correctAnswer7_5 = findCorrectAnswer(questions7[4]);

            //юзер4 отвечает корректно на пятый вопрос
            await answerUserToQuestion(loginedUsers.user4, correctAnswer7_5, app);
            //юзер2 отвечает корректно на пятый вопрос
            await answerUserToQuestion(loginedUsers.user2, correctAnswer7_5, app);


            //-----------------------------------------------------------------------------
            //восьмая игра юзер6/юзер7
            await connectUserToGame(loginedUsers.user6, app);
            const game8 = await connectUserToGame(loginedUsers.user7, app);
            debugger;
            const questions8 = game8.questions;
            const correctAnswer8_1 = findCorrectAnswer(questions8[0]);

            //юзер6 отвечает корректно на первый вопрос
            await answerUserToQuestion(loginedUsers.user6, correctAnswer8_1, app);
            //юзер7 отвечает не корректно на первый вопрос
            await answerUserToQuestion(loginedUsers.user7, '', app);

            const correctAnswer8_2 = findCorrectAnswer(questions8[1]);

            //юзер6 отвечает корректно на второй вопрос
            await answerUserToQuestion(loginedUsers.user6, correctAnswer8_2, app);
            //юзер7 отвечает некорректно на второй вопрос
            await answerUserToQuestion(loginedUsers.user7, '', app);

            const correctAnswer8_3 = findCorrectAnswer(questions8[2]);

            //юзер6 отвечает корректно на третий вопрос
            await answerUserToQuestion(loginedUsers.user6, correctAnswer8_3, app);
            //юзер7 отвечает корректно на третий вопрос
            await answerUserToQuestion(loginedUsers.user7, '', app);

            const correctAnswer8_4 = findCorrectAnswer(questions8[3]);

            // юзер6 отвечает корректно на четвертый вопрос
            await answerUserToQuestion(loginedUsers.user6, correctAnswer8_4, app);
            // юзер7 отвечает корректно на четвертый вопрос
            await answerUserToQuestion(loginedUsers.user7, correctAnswer8_4, app);

            const correctAnswer8_5 = findCorrectAnswer(questions7[4]);

            //юзер6 отвечает корректно на пятый вопрос
            await answerUserToQuestion(loginedUsers.user6, correctAnswer8_5, app);
            //юзер7 отвечает корректно на пятый вопрос
            await answerUserToQuestion(loginedUsers.user7, correctAnswer8_5, app);


              //-----------------------------------------------------------------------------
            //девятая игра юзер2/юзер7
            await connectUserToGame(loginedUsers.user2, app);
            const game9 = await connectUserToGame(loginedUsers.user7, app);
            debugger;
            const questions9 = game9.questions;
            const correctAnswer9_1 = findCorrectAnswer(questions9[0]);

            //юзер2 отвечает корректно на первый вопрос
            await answerUserToQuestion(loginedUsers.user2, '', app);
            //юзер7 отвечает не корректно на первый вопрос
            await answerUserToQuestion(loginedUsers.user7, correctAnswer9_1, app);

            const correctAnswer9_2 = findCorrectAnswer(questions9[1]);

            //юзер2 отвечает корректно на второй вопрос
            await answerUserToQuestion(loginedUsers.user2, '', app);
            //юзер7 отвечает некорректно на второй вопрос
            await answerUserToQuestion(loginedUsers.user7, correctAnswer9_2, app);

            const correctAnswer9_3 = findCorrectAnswer(questions8[2]);

            //юзер2 отвечает корректно на третий вопрос
            await answerUserToQuestion(loginedUsers.user2, '', app);
            //юзер7 отвечает корректно на третий вопрос
            await answerUserToQuestion(loginedUsers.user7, correctAnswer9_3, app);

            const correctAnswer9_4 = findCorrectAnswer(questions9[3]);

            // юзер2 отвечает корректно на четвертый вопрос
            await answerUserToQuestion(loginedUsers.user2, correctAnswer9_4, app);
            // юзер7 отвечает корректно на четвертый вопрос
            await answerUserToQuestion(loginedUsers.user7, correctAnswer9_4, app);

            const correctAnswer9_5 = findCorrectAnswer(questions7[4]);

            //юзер2 отвечает корректно на пятый вопрос
            await answerUserToQuestion(loginedUsers.user2, correctAnswer9_5, app);
            //юзер7 отвечает корректно на пятый вопрос
            await answerUserToQuestion(loginedUsers.user7, correctAnswer9_5, app);


               //-----------------------------------------------------------------------------
            //десятая игра юзер3/юзер6
            await connectUserToGame(loginedUsers.user3, app);
            const game10 = await connectUserToGame(loginedUsers.user6, app);
            debugger;
            const questions10 = game10.questions;
            const correctAnswer10_1 = findCorrectAnswer(questions10[0]);

            //юзер3 отвечает корректно на первый вопрос
            await answerUserToQuestion(loginedUsers.user3, correctAnswer10_1, app);
            //юзер6 отвечает не корректно на первый вопрос
            await answerUserToQuestion(loginedUsers.user6, correctAnswer10_1, app);

            const correctAnswer10_2 = findCorrectAnswer(questions10[1]);

            //юзер3 отвечает корректно на второй вопрос
            await answerUserToQuestion(loginedUsers.user3, '', app);
            //юзер6 отвечает некорректно на второй вопрос
            await answerUserToQuestion(loginedUsers.user6, correctAnswer10_2, app);

            const correctAnswer10_3 = findCorrectAnswer(questions8[2]);

            //юзер3 отвечает корректно на третий вопрос
            await answerUserToQuestion(loginedUsers.user3, '', app);
            //юзер6 отвечает корректно на третий вопрос
            await answerUserToQuestion(loginedUsers.user6, correctAnswer10_3, app);

            const correctAnswer10_4 = findCorrectAnswer(questions10[3]);

            // юзер3 отвечает корректно на четвертый вопрос
            await answerUserToQuestion(loginedUsers.user3, correctAnswer10_4, app);
            // юзер6 отвечает корректно на четвертый вопрос
            await answerUserToQuestion(loginedUsers.user6, '', app);

            const correctAnswer10_5 = findCorrectAnswer(questions10[4]);

            //юзер3 отвечает корректно на пятый вопрос
            await answerUserToQuestion(loginedUsers.user3, correctAnswer10_5, app);
            //юзер6 отвечает корректно на пятый вопрос
            await answerUserToQuestion(loginedUsers.user6, correctAnswer10_5, app);
        */


        // // Данные, которые вы хотите записать в файл
        // const bearer = `bearer 1 юзера: ${loginedUsers.user2.tokens.accessTokenInBody}, \`id игры: ${game1.id}\``;
        //
        // // Вызов функции
        // await writeToFile(bearer);
        // expect(1).toBe(1);
    });
});
