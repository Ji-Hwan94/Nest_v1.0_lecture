import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import {
  TypeormLoggerMiddleware,
  SessionRefreshMiddleware,
} from './middlewares';
import { NoticeModule } from './domain/support/notice/notice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoginModule,
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
    NoticeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionRefreshMiddleware).forRoutes('*'); // 모든 라우트에 적용
  }
}
