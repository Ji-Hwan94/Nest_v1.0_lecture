import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

declare const module: any;

async function bootstrap() {
  if (!process.env.SESSION_KEY) {
    throw new Error('SESSION_KEY 환경변수가 설정되지 않았습니다!');
  }

  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: process.env.SESSION_KEY,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: false,
        sameSite: 'lax',
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.PORT ?? 3000);

  // hot reloading 설정
  // 서버 해놓고 껐다 켰다하는거 방지하는거임
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
