import {
  Controller,
  Get,
  Query,
  Res,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { promises as fs } from 'fs';
import { join } from 'path';
import * as path from 'path';

@Controller('/common/')
export class FileController {
  private logger = new Logger('FileController');

  /**
   * 파일을 서빙하는 API (logicalPath를 통한 가상 경로 사용)
   * @param logicalPath 논리적 파일 경로 (serverfile 제외)
   * @param res Express Response 객체
   */
  @Get('getImage.do')
  async getFile(@Query('path') logicalPath: string, @Res() res: Response) {
    try {
      // logicalPath가 없으면 에러
      if (!logicalPath) {
        throw new BadRequestException('path 파라미터가 필요합니다.');
      }

      // 환경변수에서 실제 파일 저장소 경로 가져오기
      const rootPath = process.env.FILEUPLOAD_ROOT_PATH || 'V:\\FileRepository';

      // logicalPath에서 serverfile 경로 제거 (이미 가상 경로이므로)
      let cleanPath = logicalPath;

      if (logicalPath.startsWith('\\serverfile')) {
        cleanPath = logicalPath.substring('\\serverfile'.length);
      } else if (logicalPath.startsWith('/serverfile')) {
        cleanPath = logicalPath.substring('/serverfile'.length);
      }

      // 한글 경로 처리 (URL 디코딩)
      try {
        cleanPath = decodeURIComponent(cleanPath);
      } catch (error) {
        this.logger.warn(`경로 디코딩 실패: ${cleanPath}`);
      }

      // 실제 파일 경로 생성
      const physicalPath = join(rootPath, cleanPath);

      this.logger.log(`파일 요청: ${logicalPath} -> ${physicalPath}`);

      // 파일 존재 여부 확인
      try {
        await fs.access(physicalPath);
      } catch (error) {
        this.logger.error(`파일을 찾을 수 없습니다: ${physicalPath}`);
        throw new NotFoundException('파일을 찾을 수 없습니다.');
      }

      // 파일 정보 가져오기
      const stats = await fs.stat(physicalPath);

      // 파일 확장자로 Content-Type 결정
      const ext = path.extname(physicalPath).toLowerCase();
      const contentType = this.getContentType(ext);

      // 파일 읽기
      const fileBuffer = await fs.readFile(physicalPath);

      // 응답 헤더 설정
      res.set({
        'Content-Type': contentType,
        'Content-Length': stats.size.toString(),
        'X-Content-Type-Options': 'nosniff',
      });

      // 파일 전송
      res.send(fileBuffer);
    } catch (error) {
      this.logger.error(`파일 서빙 오류: ${error.message}`);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new BadRequestException('파일을 읽을 수 없습니다.');
    }
  }

  /**
   * 파일 확장자에 따른 Content-Type 반환
   * @param ext 파일 확장자
   * @returns Content-Type
   */
  private getContentType(ext: string): string {
    switch (ext) {
      // 이미지 파일
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.gif':
        return 'image/gif';
      case '.bmp':
        return 'image/bmp';
      case '.webp':
        return 'image/webp';
      case '.svg':
        return 'image/svg+xml';
      case '.ico':
        return 'image/x-icon';
      case '.tiff':
      case '.tif':
        return 'image/tiff';

      // 문서 파일
      case '.pdf':
        return 'application/pdf';
      case '.doc':
        return 'application/msword';
      case '.docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case '.xls':
        return 'application/vnd.ms-excel';
      case '.xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case '.ppt':
        return 'application/vnd.ms-powerpoint';
      case '.pptx':
        return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      case '.txt':
        return 'text/plain';
      case '.rtf':
        return 'application/rtf';

      // 텍스트 파일
      case '.html':
      case '.htm':
        return 'text/html';
      case '.css':
        return 'text/css';
      case '.js':
        return 'application/javascript';
      case '.json':
        return 'application/json';
      case '.xml':
        return 'application/xml';
      case '.csv':
        return 'text/csv';

      // 압축 파일
      case '.zip':
        return 'application/zip';
      case '.rar':
        return 'application/x-rar-compressed';
      case '.7z':
        return 'application/x-7z-compressed';
      case '.tar':
        return 'application/x-tar';
      case '.gz':
        return 'application/gzip';

      // 오디오 파일
      case '.mp3':
        return 'audio/mpeg';
      case '.wav':
        return 'audio/wav';
      case '.ogg':
        return 'audio/ogg';
      case '.m4a':
        return 'audio/mp4';
      case '.flac':
        return 'audio/flac';

      // 비디오 파일
      case '.mp4':
        return 'video/mp4';
      case '.avi':
        return 'video/x-msvideo';
      case '.mov':
        return 'video/quicktime';
      case '.wmv':
        return 'video/x-ms-wmv';
      case '.flv':
        return 'video/x-flv';
      case '.webm':
        return 'video/webm';
      case '.mkv':
        return 'video/x-matroska';

      // 기타 파일
      case '.exe':
        return 'application/x-msdownload';
      case '.msi':
        return 'application/x-msi';
      case '.apk':
        return 'application/vnd.android.package-archive';
      case '.ipa':
        return 'application/octet-stream';

      // 기본값
      default:
        return 'application/octet-stream';
    }
  }
}
