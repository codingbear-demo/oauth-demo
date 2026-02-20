import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import session from 'express-session';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const passport = require('passport');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isProd = process.env.NODE_ENV === 'production';
  const secret = process.env.SESSION_SECRET as string;
  const port = parseInt(process.env.PORT || '3000', 10);

  // Trust proxy (required for HTTPS behind Nginx)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (app.getHttpAdapter().getInstance() as any).set('trust proxy', 1);

  // Middleware order matters
  app.use(cookieParser());
  app.use(
    session({
      secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
