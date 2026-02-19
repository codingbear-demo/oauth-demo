import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const passport = require('passport') as typeof import('passport');

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.use(cookieParser());
    app.use(
      session({
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
        cookie: { httpOnly: true, secure: false, sameSite: 'lax' },
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /auth/google', () => {
    it('should redirect to Google OAuth (302)', async () => {
      const res = await request(app.getHttpServer())
        .get('/auth/google')
        .redirects(0); // don't follow redirects

      expect(res.status).toBe(302);
      expect(res.headers.location).toContain('accounts.google.com');
    });
  });

  describe('GET /auth/google/callback', () => {
    it('should redirect to /error on invalid callback request', async () => {
      const res = await request(app.getHttpServer())
        .get('/auth/google/callback')
        .query({ error: 'access_denied' })
        .redirects(0);

      // Passport fails, AuthExceptionFilter catches → redirect to /error
      expect(res.status).toBe(302);
      expect(res.headers.location).toBe('/error');
    });
  });
});
