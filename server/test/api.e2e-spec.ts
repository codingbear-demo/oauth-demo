import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import type { Profile } from 'passport-google-oauth20';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const passport = require('passport') as typeof import('passport');

function makeProfile(): Profile {
  return {
    id: 'e2e-test-user',
    displayName: 'E2E Test User',
    emails: [{ value: 'e2e@example.com', verified: 'true' }],
    provider: 'google',
    photos: [],
    name: { familyName: 'User', givenName: 'E2E' },
    profileUrl: '',
    _raw: '',
    _json: {} as any,
  } as Profile;
}

describe('ApiController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;

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

    authService = app.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/me', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app.getHttpServer()).get('/api/me');
      expect(res.status).toBe(401);
    });

    it('should store user in authService and match expected shape', () => {
      const profile = makeProfile();
      const user = authService.findOrCreate(profile);

      expect(user).toMatchObject({
        id: 'e2e-test-user',
        name: 'E2E Test User',
        email: 'e2e@example.com',
        provider: 'google',
      });
    });
  });

  describe('POST /api/logout', () => {
    it('should return 200 and {message: "Logged out"} even when not authenticated', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/logout')
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Logged out' });
    });
  });
});
