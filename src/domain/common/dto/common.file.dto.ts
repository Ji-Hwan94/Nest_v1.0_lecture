export class FileDto {
  fieldname: string; // 폼 필드 이름 ('file')
  originalname: string; // 원본 파일명
  encoding: string; // 파일 인코딩
  mimetype: string; // 파일 MIME 타입
  size: number; // 파일 크기
  destination: string; // 저장 경로
  filename: string; // 저장된 파일명
  path: string; // 전체 파일 경로
  buffer: Buffer; // 파일 데이터
}
