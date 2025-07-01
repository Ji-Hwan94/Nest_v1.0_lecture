// 파일 정보 조회 결과 타입
export interface FileInfoResult {
  filePath: string;
  fileSize: number;
  createdDate: Date;
  modifiedDate: Date;
}

// 파일 업로드 결과 타입
export interface UploadResult {
  originalName: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadDate: Date;
  url: string;
  physicalPath: string;
  logicalPath: string;
  fileExt: string;
}

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

// 파일 업로드 설정 타입
export interface UploadConfig {
  subDir: string;
}

// 파일 DTO 타입
export interface FileDto {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

// 파일 다운로드 응답 타입
export interface FileDownloadResponse {
  file: any; // StreamableFile
  fileName: string;
}

// 파일 다운로드 요청 타입
export interface FileDownloadRequest {
  id: number;
}

// 파일 정보 타입
export interface FileInfo {
  physicalPath: string;
  fileName: string;
  fileExt?: string;
  fileSize?: number;
  logicalPath?: string;
}

// 파일 다운로드 결과 타입
export interface FileDownloadResult {
  success: boolean;
  message?: string;
  file?: any; // StreamableFile
  fileName?: string;
  error?: string;
}
