import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as dotenv from 'dotenv';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';

// HMR(Hot Module Replacement) 지원을 위한 선언
// 개발 중 코드 변경 시 서버를 완전히 재시작하지 않고도 변경사항을 반영
// 세션 메모리도 유지됨

declare const module: any;

dotenv.config();
dotenv.config({ path: '.env.upload' });

async function bootstrap() {
  // 세션 암호화 키가 없으면 서버 실행 중단
  if (!process.env.SESSION_KEY) {
    throw new Error('SESSION_KEY 환경변수가 설정되지 않았습니다!');
  }

  // Redis 클라이언트 생성
  const redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
    },
    password: process.env.REDIS_PASSWORD || undefined,
  });
  // connect-redis v6 이상에서 필요
  // @ts-ignore
  redisClient.on &&
    redisClient.on('error', (err) => console.error('Redis Client Error', err));
  await redisClient.connect();

  // NestJS 앱 생성
  const app = await NestFactory.create(AppModule);

  // express-session 미들웨어 등록 (RedisStore 적용)
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_KEY, // 세션 암호화 키
      resave: true, // 세션 데이터가 바뀌지 않아도 항상 저장(세션 만료 갱신)
      saveUninitialized: false, // 로그인 등 세션에 값이 있을 때만 저장
      rolling: true, // 사용자가 요청할 때마다 만료 시간 자동 연장
      unset: 'destroy', // 로그아웃 시 세션 완전 삭제
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7일(밀리초 단위) - 세션 쿠키 만료 시간
        httpOnly: true, // JS로 쿠키 접근 불가(XSS 방지)
        secure: process.env.NODE_ENV === 'production', // 배포 환경에서만 HTTPS 쿠키
        sameSite: 'lax', // CSRF 방지 기본값
        path: '/', // 모든 경로에서 쿠키 사용
      },
      name: 'happy-job-session', // 세션 쿠키 이름(기본 connect.sid 대신)
    }),
  );

  // passport 초기화 및 세션 연동
  // passport가 세션에서 사용자 정보(req.user)를 자동으로 꺼내줌
  app.use(passport.initialize());
  app.use(passport.session());

  // 서버 실행
  await app.listen(process.env.PORT ?? 3000);

  // hot reloading 설정
  // 서버를 완전히 재시작하지 않고 코드 변경 반영(세션 메모리 유지)
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
