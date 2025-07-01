import { Injectable, Logger } from '@nestjs/common';
import { FileDto } from 'src/domain/common/dto/common.file.dto';
import * as fs from 'fs';
import * as path from 'path';

// 파일 업로드 결과 DTO
export interface UploadResult {
  originalName: string; // 원본 파일명
  fileName: string; // 저장된 파일명
  filePath: string; // 실제 저장 경로
  fileSize: number; // 파일 크기 (bytes)
  mimeType: string; // MIME 타입
  uploadDate: Date; // 업로드 날짜
  url: string; // 웹 접근 URL
  // DB 저장용 필드들
  physicalPath: string; // 물리적 경로 (DB 저장용)
  logicalPath: string; // 논리적 경로 (DB 저장용)
  fileExt: string; // 파일 확장자
}

// 파일 업로드 설정 인터페이스
export interface UploadConfig {
  subDir: string; // 하위 디렉토리 (예: 'notices', 'profiles')
  allowedTypes?: string[]; // 허용된 MIME 타입
  maxSize?: number; // 최대 파일 크기 (bytes)
  fileNamePrefix?: string; // 파일명 접두사
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger('UploadService');
  private readonly physicalPath: string;
  private readonly logicalPath: string;

  constructor() {
    // 환경변수에서 경로 설정 가져오기 (기본값 포함)
    this.physicalPath =
      process.env.FILEUPLOAD_ROOT_PATH || 'V:\\FileRepository';
    this.logicalPath =
      process.env.FILEUPLOAD_VIRTUAL_ROOT_PATH || '/serverfile';

    this.logger.log(
      `UploadService 초기화 - PhysicalPath: ${this.physicalPath}`,
    );
    this.logger.log(`UploadService 초기화 - LogicalPath: ${this.logicalPath}`);

    // 업로드 디렉토리가 없으면 생성
    if (!fs.existsSync(this.physicalPath)) {
      try {
        fs.mkdirSync(this.physicalPath, { recursive: true });
        this.logger.log(`업로드 디렉토리 생성: ${this.physicalPath}`);
      } catch (error) {
        this.logger.error(`업로드 디렉토리 생성 실패: ${error.message}`);
        throw new Error(
          `업로드 디렉토리를 생성할 수 없습니다: ${this.physicalPath}`,
        );
      }
    }
  }

  /**
   * 파일 업로드 처리 (공통 메소드)
   * 다른 개발자들이 이 메소드만 호출하면 파일 업로드 + DB 저장용 데이터 반환
   *
   * @param file 업로드된 파일
   * @param config 업로드 설정
   * @returns DB 저장용 데이터가 포함된 업로드 결과
   */
  async uploadFile(file: FileDto, config: UploadConfig): Promise<UploadResult> {
    try {
      // 1. 파일 검증
      this.validateFile(file, config);

      // 2. 파일 저장
      const uploadResult = await this.saveFile(file, config);

      // 3. DB 저장용 데이터 가공
      const dbData = this.prepareDbData(uploadResult);

      this.logger.log(
        `파일 업로드 성공: ${uploadResult.fileName} (${config.subDir})`,
      );

      return dbData;
    } catch (error) {
      this.logger.error(`파일 업로드 실패: ${error.message}`);
      throw error;
    }
  }

  /**
   * 파일 검증
   */
  private validateFile(file: FileDto, config: UploadConfig): void {
    // 파일 타입 검증
    if (
      config.allowedTypes &&
      !this.validateFileType(file.mimetype, config.allowedTypes)
    ) {
      throw new Error(`허용되지 않는 파일 타입입니다: ${file.mimetype}`);
    }

    // 파일 크기 검증
    if (config.maxSize && !this.validateFileSize(file.size, config.maxSize)) {
      throw new Error(
        `파일 크기가 너무 큽니다: ${file.size} bytes (최대: ${config.maxSize} bytes)`,
      );
    }
  }

  /**
   * 파일 저장
   */
  private async saveFile(
    file: FileDto,
    config: UploadConfig,
  ): Promise<UploadResult> {
    // config.subDir이 없으면 에러
    if (!config.subDir) {
      throw new Error('subDir 설정이 필요합니다.');
    }

    // 경로 값들이 올바른지 확인
    if (!this.physicalPath) {
      throw new Error('physicalPath가 설정되지 않았습니다.');
    }
    if (!this.logicalPath) {
      throw new Error('logicalPath가 설정되지 않았습니다.');
    }

    // 하위 디렉토리 생성
    const targetDir = path.join(this.physicalPath, config.subDir);
    console.log('targetDir ============== ', targetDir);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    console.log('path ============== ', file.originalname);

    // 파일명 생성 (중복 방지)
    const timestamp = Date.now();
    const originalName = file.originalname;

    // 한글 파일명 처리 (multer에서 latin1로 인코딩된 파일명을 UTF-8로 변환)
    let decodedOriginalName = originalName;
    try {
      // Buffer를 사용하여 latin1에서 utf8로 변환
      decodedOriginalName = Buffer.from(originalName, 'latin1').toString(
        'utf8',
      );
      console.log('디코딩된 파일명 ============== ', decodedOriginalName);
    } catch (error) {
      this.logger.warn(`파일명 디코딩 실패: ${originalName}`);
      decodedOriginalName = originalName;
    }

    const ext = path.extname(decodedOriginalName);
    const nameWithoutExt = path.basename(decodedOriginalName, ext);
    const prefix = config.fileNamePrefix || '';
    const fileName = `${prefix}${timestamp}_${nameWithoutExt}${ext}`;
    const filePath = path.join(targetDir, fileName);
    const logicalPath = path.join(this.logicalPath, config.subDir, fileName);

    console.log('최종 파일명 ============== ', fileName);
    console.log('logicalPath ============== ', logicalPath);

    // 파일 저장 (복사)
    fs.writeFileSync(filePath, file.buffer);

    return {
      originalName,
      fileName,
      filePath,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadDate: new Date(),
      url: `/uploads/${config.subDir}/${fileName}`,
      physicalPath: filePath,
      logicalPath,
      fileExt: ext.replace('.', '').toLowerCase(),
    };
  }

  /**
   * DB 저장용 데이터 가공
   */
  private prepareDbData(uploadResult: UploadResult): UploadResult {
    return {
      ...uploadResult,
      // DB 컬럼명에 맞게 추가 가공 가능
      physicalPath: uploadResult.physicalPath.replace(/\\/g, '/'), // Windows 경로 구분자 통일
      logicalPath: uploadResult.logicalPath.replace(/\\/g, '/'), // Windows 경로 구분자 통일
    };
  }

  /**
   * 파일 삭제
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(`파일 삭제 성공: ${filePath}`);
      }
    } catch (error) {
      this.logger.error(`파일 삭제 실패: ${error.message}`);
      throw error;
    }
  }

  /**
   * 파일 정보 조회
   */
  async getFileInfo(filePath: string): Promise<any> {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error('파일이 존재하지 않습니다.');
      }

      const stats = fs.statSync(filePath);
      return {
        filePath,
        fileSize: stats.size,
        createdDate: stats.birthtime,
        modifiedDate: stats.mtime,
      };
    } catch (error) {
      this.logger.error(`파일 정보 조회 실패: ${error.message}`);
      throw error;
    }
  }

  /**
   * 허용된 파일 타입 검증
   */
  private validateFileType(mimeType: string, allowedTypes: string[]): boolean {
    return allowedTypes.includes(mimeType);
  }

  /**
   * 파일 크기 검증
   */
  private validateFileSize(fileSize: number, maxSize: number): boolean {
    return fileSize <= maxSize;
  }
}
