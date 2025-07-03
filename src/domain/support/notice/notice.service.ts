import { TbUserinfo } from 'src/entities/TbUserinfo';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  Param,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TbNotice } from 'src/entities/TbNotice';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { FileDto } from 'src/common/file/file.dto';
import {
  ReqNoticeSearchDto,
  ReqNoticeTextDto,
  ReqNoticeUpdateDto,
} from './dto/notice.request.dto';
import { UploadService } from 'src/common/upload/upload.service';
import { FileService } from 'src/common/file/file.service';
import { FileDownloadResponse } from 'src/common/upload/upload.dto';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(TbNotice)
    private noticeRepository: Repository<TbNotice>,
    private uploadService: UploadService,
    private fileService: FileService,
  ) {}

  private logger = new Logger('HTTP');

  private subDir = process.env.FILEUPLOAD_NOTICE_PATH || 'notices';

  // 메서드에 async를 사용하는 것이 좋습니다. 그 이유는 다음과 같습니다:
  // 1. 일관성
  // getMany()와 getCount()는 모두 데이터베이스 작업을 수행하는 비동기 메서드입니다
  // 다른 데이터베이스 작업 메서드들과 동일한 패턴을 유지하는 것이 좋습니다
  // 2. 에러 처리
  // 비동기 작업의 에러를 더 효과적으로 처리할 수 있습니다
  // try/catch 블록이 비동기 작업의 에러도 잡을 수 있습니다
  // 3. 확장성
  // 나중에 추가적인 비동기 작업이 필요할 때 쉽게 확장할 수 있습니다
  // 예: 캐싱, 로깅 등의 비동기 작업 추가
  async getNoticeList(searchData: ReqNoticeSearchDto): Promise<any[]> {
    try {
      const queryBuilder = this.noticeRepository
        .createQueryBuilder('notice')
        .select([
          'notice.noticeId as noticeId',
          'notice.noticeTitle as noticeTitle',
          'notice.noticeContent as noticeContent',
          'notice.noticeRegDate as noticeRegDate',
          'user.loginId as loginId',
        ])
        .orderBy('notice.noticeId', 'DESC')
        .leftJoin('notice.login', 'user')
        .offset((searchData.currentPage - 1) * searchData.pageSize)
        .limit(searchData.pageSize);

      // 검색 조건 적용
      if (searchData) {
        if (searchData.searchTitle?.trim()) {
          queryBuilder.andWhere('notice.noticeTitle LIKE :title', {
            title: `%${searchData.searchTitle}%`,
          });
        }

        if (searchData.searchStDate?.trim()) {
          queryBuilder.andWhere('DATE(notice.noticeRegDate) >= :startDate', {
            startDate: searchData.searchStDate,
          });
        }

        if (searchData.searchEdDate?.trim()) {
          queryBuilder.andWhere('DATE(notice.noticeRegDate) <= :endDate', {
            endDate: searchData.searchEdDate,
          });
        }
      }

      return await queryBuilder.getRawMany();
    } catch (error) {
      throw new InternalServerErrorException(
        `공지사항 조회 중 오류가 발생했습니다. ${error}`,
      );
    }
  }

  async getNoticeCount(searchData: ReqNoticeSearchDto): Promise<number> {
    try {
      const queryBuilder = this.noticeRepository
        .createQueryBuilder('notice')
        .select(['notice.noticeId']);

      // 검색 조건 적용
      if (searchData) {
        if (searchData.searchTitle?.trim()) {
          queryBuilder.andWhere('notice.noticeTitle LIKE :title', {
            title: `%${searchData.searchTitle}%`,
          });
        }

        if (searchData.searchStDate?.trim()) {
          queryBuilder.andWhere('DATE(notice.noticeRegDate) >= :startDate', {
            startDate: searchData.searchStDate,
          });
        }

        if (searchData.searchEdDate?.trim()) {
          queryBuilder.andWhere('DATE(notice.noticeRegDate) <= :endDate', {
            endDate: searchData.searchEdDate,
          });
        }
      }

      return await queryBuilder.getCount();
    } catch (error) {
      throw new InternalServerErrorException(
        `공지사항 조회 중 오류가 발생했습니다. ${error}`,
      );
    }
  }

  async create(
    text: ReqNoticeTextDto,
    file: FileDto,
    loginId: string,
  ): Promise<InsertResult> {
    try {
      const getMaxId = await this.noticeRepository
        .createQueryBuilder()
        .select('IFNULL(MAX(TbNotice.notice_id), 0)', 'maxId')
        .getRawOne();

      const nextId = Number(getMaxId.maxId) + 1;

      // 파일 업로드 처리 (공통 서비스 사용)
      let uploadResult: any = null;
      if (file) {
        uploadResult = await this.uploadService.uploadFile(file, this.subDir);
      }

      // 공지사항 저장
      const queryBuilder = this.noticeRepository
        .createQueryBuilder()
        .insert()
        .into(TbNotice)
        .values({
          noticeId: nextId,
          loginId: 'admin',
          noticeTitle: text.title.trim(),
          noticeContent: text.content.trim(),
          noticeRegDate: () => 'NOW()',
          // 파일 정보 저장 (DB 컬럼명에 맞게)
          ...(uploadResult && {
            fileName: uploadResult.originalName,
            fileExt: uploadResult.fileExt,
            fileSize: uploadResult.fileSize,
            physicalPath: uploadResult.physicalPath,
            logicalPath: uploadResult.logicalPath,
          }),
        })
        .execute();

      return await queryBuilder;
    } catch (error) {
      throw new InternalServerErrorException(
        `공지사항 등록 중 오류가 발생했습니다. ${error}`,
      );
    }
  }

  async findOne(id: number) {
    try {
      const getDetail = await this.noticeRepository
        .createQueryBuilder()
        .select([
          'TbNotice.noticeId',
          'TbNotice.loginId',
          'TbNotice.noticeTitle',
          'TbNotice.noticeContent',
          'TbNotice.noticeRegDate',
          'TbNotice.fileName',
          'TbNotice.fileExt',
          'TbNotice.fileSize',
          'TbNotice.physicalPath',
          'TbNotice.logicalPath',
        ])
        .where('TbNotice.noticeId = :id', { id: id })
        .getOne();

      return getDetail;
    } catch (error) {
      throw new InternalServerErrorException(
        `공지사항 단건 조회 중 오류가 발생했습니다. ${error}`,
      );
    }
  }

  async update(
    updateNoticeDto: ReqNoticeUpdateDto,
    file: FileDto,
  ): Promise<UpdateResult> {
    try {
      // 기존 공지사항 정보 조회 (파일 정보 포함)
      const existingNotice = await this.noticeRepository
        .createQueryBuilder()
        .select(['TbNotice.physicalPath'])
        .where('TbNotice.notice_id = :id', { id: updateNoticeDto.noticeId })
        .getOne();

      // 변경할 기존 파일이 있으면 삭제
      if (existingNotice?.physicalPath) {
        this.logger.log('기존 파일 있음');
        try {
          const fs = await import('fs/promises');
          await fs.unlink(existingNotice.physicalPath);
          this.logger.log(
            `기존 파일 삭제 완료: ${existingNotice.physicalPath}`,
          );
        } catch (error) {
          this.logger.warn(
            `기존 파일 삭제 실패: ${existingNotice.physicalPath}`,
            error.message,
          );
          // 파일 삭제 실패해도 계속 진행
        }
      }

      // 파일 업로드 처리 (공통 서비스 사용)
      let uploadResult: any = null;
      if (file) {
        this.logger.log('파일 있음');
        uploadResult = await this.uploadService.uploadFile(file, this.subDir);
      }

      console.log('uploadResult ============== ', uploadResult);

      const queryBuilder = await this.noticeRepository
        .createQueryBuilder()
        .update(TbNotice)
        .set({
          noticeTitle: updateNoticeDto.title,
          noticeContent: updateNoticeDto.content,
          noticeUpdateDate: () => 'NOW()',
          // uploadResult이 존재할 때만 파일 관련 필드 업데이트
          ...(uploadResult && {
            fileName: uploadResult.originalName,
            fileExt: uploadResult.fileExt,
            fileSize: uploadResult.fileSize,
            physicalPath: uploadResult.physicalPath,
            logicalPath: uploadResult.logicalPath,
          }),
        })
        .where('notice_id = :id', { id: updateNoticeDto.noticeId })
        .execute();

      return queryBuilder;
    } catch (error) {
      throw new InternalServerErrorException(
        `공지사항 수정 중 오류가 발생했습니다. ${error}`,
      );
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    try {
      // 기존 공지사항 정보 조회 (파일 정보 포함)
      const existingNotice = await this.noticeRepository
        .createQueryBuilder()
        .select(['TbNotice.physicalPath'])
        .where('TbNotice.notice_id = :id', { id })
        .getOne();
      console.log('existingNotice ============== ', existingNotice);
      // 변경할 기존 파일이 있으면 삭제
      if (existingNotice?.physicalPath) {
        this.logger.log('기존 파일 있음');
        try {
          const fs = await import('fs/promises');
          await fs.unlink(existingNotice.physicalPath);
          this.logger.log(
            `기존 파일 삭제 완료: ${existingNotice.physicalPath}`,
          );
        } catch (error) {
          this.logger.warn(
            `기존 파일 삭제 실패: ${existingNotice.physicalPath}`,
            error.message,
          );
          // 파일 삭제 실패해도 계속 진행
        }
      }

      const queryBuilder = await this.noticeRepository
        .createQueryBuilder()
        .delete()
        .from(TbNotice)
        .where('noticeId = :id', { id })
        .execute();

      return queryBuilder;
    } catch (error) {
      throw new InternalServerErrorException(
        `공지사항 삭제 중 오류가 발생했습니다. ${error}`,
      );
    }
  }

  async downloadFile(id: number): Promise<FileDownloadResponse> {
    try {
      const notice = await this.noticeRepository
        .createQueryBuilder()
        .select(['TbNotice.physicalPath', 'TbNotice.fileName'])
        .where('TbNotice.notice_id = :id', { id })
        .getOne();

      if (!notice) {
        throw new InternalServerErrorException('공지사항을 찾을 수 없습니다.');
      }

      if (!notice.physicalPath) {
        throw new InternalServerErrorException('첨부된 파일이 없습니다.');
      }

      // 파일 다운로드 처리
      const streamableFile = await this.fileService.downloadFile(
        notice.physicalPath!,
        notice.fileName || 'unknown',
      );

      return {
        file: streamableFile,
        fileName: notice.fileName || 'unknown',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `파일 다운로드 중 오류가 발생했습니다. ${error}`,
      );
    }
  }
}
