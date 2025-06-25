import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TbNotice } from 'src/entities/TbNotice';

@Module({
  // imports: 다른 모듈을 가져와서 사용할 때 (예: TypeORM, 다른 기능 모듈 등)
  imports: [TypeOrmModule.forFeature([TbNotice])],

  // controllers: 요청을 받고 응답을 반환하는 API 엔드포인트 정의
  controllers: [NoticeController],

  // providers: 비즈니스 로직을 담당하는 서비스나 기타 의존성 주입할 클래스들
  providers: [NoticeService],
})
// NoticeModule: 공지사항 관련 기능을 묶어놓은 단위 모듈
export class NoticeModule {}
