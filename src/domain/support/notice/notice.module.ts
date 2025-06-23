import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TbNotice } from 'src/entities/TbNotice';

@Module({
  imports: [TypeOrmModule.forFeature([TbNotice])],
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
