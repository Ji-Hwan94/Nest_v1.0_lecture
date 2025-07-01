import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';

@Module({
  providers: [UploadService],
  exports: [UploadService], // 다른 모듈에서 사용할 수 있도록 export
})
export class UploadModule {}
