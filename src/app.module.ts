import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import {
  TypeormLoggerMiddleware,
  SessionRefreshMiddleware,
} from './middlewares';
import { NoticeModule } from './domain/support/notice/notice.module';
import { FileModule } from './common/file/file.module';
import { LoginModule } from './domain/login/login.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // 정적 파일 서빙 설정 - V:\FileRepository를 /serverfile로 매핑
    ServeStaticModule.forRoot({
      rootPath: process.env.FILEUPLOAD_ROOT_PATH || 'V:\\FileRepository', // 환경변수로 설정 가능
      serveRoot: process.env.FILEUPLOAD_VIRTUAL_ROOT_PATH || '/serverfile', // URL 경로
      serveStaticOptions: {
        index: false, // 디렉토리 인덱스 비활성화
        dotfiles: 'deny', // 숨김 파일 접근 거부
        setHeaders: (res, path) => {
          // 파일 다운로드 시 적절한 헤더 설정
          res.set('X-Content-Type-Options', 'nosniff');
          res.set('X-Frame-Options', 'DENY');
        },
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/entities/*.{ts,js}'],
      synchronize: false,
      logging: true,
      logger: new TypeormLoggerMiddleware(),
      charset: 'utf8mb4',
      autoLoadEntities: true,
    }),
    // 모듈 추가
    LoginModule,
    NoticeModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionRefreshMiddleware).forRoutes('*'); // 모든 라우트에 적용
  }
}
