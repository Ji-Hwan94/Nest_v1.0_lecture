import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import * as path from 'path';
import { createReadStream } from 'fs';

@Injectable()
export class FileService {
  private logger = new Logger('FileService');

  /**
   * 파일 업로드 (기존 파일 삭제 후 새 파일 업로드)
   * @param fileBuffer 파일 버퍼
   * @param targetPath 저장할 경로
   * @param originalName 원본 파일명
   * @returns 업로드 결과
   */
  async uploadFile(
    fileBuffer: Buffer,
    targetPath: string,
    originalName: string,
  ) {
    try {
      // targetPath가 없으면 에러
      if (!targetPath) {
        throw new BadRequestException('저장할 경로가 필요합니다.');
      }

      // 환경변수에서 실제 파일 저장소 경로 가져오기
      const rootPath = process.env.FILEUPLOAD_ROOT_PATH || 'V:\\FileRepository';

      // targetPath에서 serverfile 경로 제거
      let cleanPath = targetPath;
      if (targetPath.startsWith('/serverfile')) {
        cleanPath = targetPath.substring('/serverfile'.length);
      }

      // 실제 파일 경로 생성
      const physicalPath = join(rootPath, cleanPath);
      const directory = path.dirname(physicalPath);

      this.logger.log(`파일 업로드 요청: ${targetPath} -> ${physicalPath}`);

      // 디렉토리가 없으면 생성
      try {
        await fs.mkdir(directory, { recursive: true });
      } catch (error) {
        this.logger.error(`디렉토리 생성 실패: ${directory}`);
        throw new BadRequestException('디렉토리를 생성할 수 없습니다.');
      }

      // 기존 파일이 있으면 삭제
      try {
        await fs.access(physicalPath);
        await fs.unlink(physicalPath);
        this.logger.log(`기존 파일 삭제: ${physicalPath}`);
      } catch (error) {
        // 파일이 없으면 무시 (정상적인 경우)
        this.logger.log(`기존 파일 없음: ${physicalPath}`);
      }

      // 새 파일 저장
      await fs.writeFile(physicalPath, fileBuffer);

      this.logger.log(`파일 업로드 완료: ${physicalPath}`);

      // 파일 정보 반환
      const stats = await fs.stat(physicalPath);
      const fileExt = path.extname(originalName).toLowerCase();

      return {
        originalName: originalName,
        fileName: path.basename(physicalPath),
        fileExt: fileExt,
        fileSize: stats.size,
        physicalPath: physicalPath,
        logicalPath: targetPath,
      };
    } catch (error) {
      this.logger.error(`파일 업로드 오류: ${error.message}`);
      throw error;
    }
  }

  /**
   * 파일 삭제
   * @param targetPath 삭제할 파일 경로
   * @returns 삭제 결과
   */
  async deleteFile(targetPath: string) {
    try {
      // targetPath가 없으면 에러
      if (!targetPath) {
        throw new BadRequestException('삭제할 파일 경로가 필요합니다.');
      }

      // 환경변수에서 실제 파일 저장소 경로 가져오기
      const rootPath = process.env.FILEUPLOAD_ROOT_PATH || 'V:\\FileRepository';

      // targetPath에서 serverfile 경로 제거
      let cleanPath = targetPath;
      if (targetPath.startsWith('/serverfile')) {
        cleanPath = targetPath.substring('/serverfile'.length);
      }

      // 실제 파일 경로 생성
      const physicalPath = join(rootPath, cleanPath);

      this.logger.log(`파일 삭제 요청: ${targetPath} -> ${physicalPath}`);

      // 파일 존재 여부 확인
      try {
        await fs.access(physicalPath);
      } catch (error) {
        this.logger.error(`파일을 찾을 수 없습니다: ${physicalPath}`);
        throw new NotFoundException('파일을 찾을 수 없습니다.');
      }

      // 파일 삭제
      await fs.unlink(physicalPath);

      this.logger.log(`파일 삭제 완료: ${physicalPath}`);

      return {
        success: true,
        message: '파일이 성공적으로 삭제되었습니다.',
        path: targetPath,
        physicalPath: physicalPath,
      };
    } catch (error) {
      this.logger.error(`파일 삭제 오류: ${error.message}`);
      throw error;
    }
  }

  /**
   * 파일 존재 여부 확인
   * @param targetPath 확인할 파일 경로
   * @returns 파일 존재 여부
   */
  async fileExists(targetPath: string): Promise<boolean> {
    try {
      if (!targetPath) {
        return false;
      }

      const rootPath = process.env.FILEUPLOAD_ROOT_PATH || 'V:\\FileRepository';
      let cleanPath = targetPath;

      if (targetPath.startsWith('/serverfile')) {
        cleanPath = targetPath.substring('/serverfile'.length);
      }

      const physicalPath = join(rootPath, cleanPath);
      await fs.access(physicalPath);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 파일 다운로드
   * @param physicalPath 실제 파일 경로
   * @param originalName 원본 파일명
   * @returns StreamableFile
   */
  async downloadFile(
    physicalPath: string,
    originalName: string,
  ): Promise<StreamableFile> {
    try {
      if (!physicalPath) {
        throw new BadRequestException('파일 경로가 필요합니다.');
      }

      // 파일 존재 여부 확인
      try {
        // 파일 존재 여부 확인
        await fs.access(physicalPath);
      } catch (error) {
        this.logger.error(`파일을 찾을 수 없습니다: ${physicalPath}`);
        throw new NotFoundException('파일을 찾을 수 없습니다.');
      }

      // 파일 스트림 생성
      // 파일 스트림이란? 경로에 있는 파일을 읽어와서 메모리에 저장하는 것 (Ram에 저장)
      const fileStream = createReadStream(physicalPath);

      this.logger.log(`파일 다운로드: ${physicalPath} -> ${originalName}`);

      // StreamableFile? 파일 스트림을 바로 반환하는 객체
      return new StreamableFile(fileStream);
    } catch (error) {
      this.logger.error(`파일 다운로드 오류: ${error.message}`);
      throw error;
    }
  }
}
