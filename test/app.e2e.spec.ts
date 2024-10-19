import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { applyAppSettings } from 'src/settings/apply-app-settings';

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
  });

  afterAll(async () => {
    if (app) {
      await app.close(); // Проверка, чтобы app не была undefined
    }
  });

  it('combined test', async () => {
    const createUser = async ({ login, email, password }) => {
      const response = await request(app.getHttpServer())
        .post('/sa/users')
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({ login, email, password });
      expect(response.body.id).toStrictEqual(expect.any(String));
      expect(response.body.createdAt).toStrictEqual(expect.any(String));
      expect(response.body.login).toStrictEqual(createUserDto.login);
      expect(response.body.email).toStrictEqual(createUserDto.email);

      return response.body;
    };

    const createUserDto = {
      login: 'user1',
      password: 'qwerty',
      email: 'vlad1@mail.ru',
    };

    const createdUser = await createUser(createUserDto);

    const loginInSystem = async ({ login, password }) => {
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

    const tokens = await loginInSystem({
      login: createdUser.login,
      password: createUserDto.password,
    });
    const AuthMe = async (accessTokenInBody: string) => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessTokenInBody}`);
      expect(response.status).toBe(200);
      return response.body;
    };

    const userInfo = await AuthMe(tokens.accessTokenInBody);

    expect(createdUser.id).toBe(userInfo.userId);
    expect(createdUser.login).toBe(userInfo.login);
    expect(createdUser.email).toBe(userInfo.email);
  });
});
