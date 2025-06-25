import {
  Injectable,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TbNotice } from 'src/entities/TbNotice';
import { Repository } from 'typeorm';
import { FileDto } from 'src/domain/common/dto/common.file.dto';
import {
  ReqNoticeSearchDto,
  ReqNoticeTextDto,
  ReqNoticeUpdateDto,
} from './dto/notice.request.dto';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(TbNotice)
    private noticeRepository: Repository<TbNotice>,
  ) {}

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
  async getNoticeList(searchData: ReqNoticeSearchDto): Promise<TbNotice[]> {
    try {
      const queryBuilder = this.noticeRepository
        .createQueryBuilder()
        .select([
          'TbNotice.noticeId',
          'TbNotice.loginId',
          'TbNotice.noticeTitle',
          'TbNotice.noticeContent',
          'TbNotice.noticeRegDate',
        ])
        .orderBy('TbNotice.noticeRegDate', 'DESC')
        .skip((searchData.currentPage - 1) * searchData.pageSize)
        .take(searchData.pageSize);

      // 검색 조건 적용
      if (searchData) {
        if (searchData.searchTitle?.trim()) {
          queryBuilder.andWhere('noticeTitle LIKE :title', {
            title: `%${searchData.searchTitle}%`,
          });
        }

        if (searchData.searchStDate?.trim()) {
          queryBuilder.andWhere('DATE(noticeRegDate) >= :startDate', {
            startDate: searchData.searchStDate,
          });
        }

        if (searchData.searchEdDate?.trim()) {
          queryBuilder.andWhere('DATE(noticeRegDate) <= :endDate', {
            endDate: searchData.searchEdDate,
          });
        }
      }

      return await queryBuilder.getMany();
    } catch (error) {
      throw new InternalServerErrorException(
        `공지사항 조회 중 오류가 발생했습니다. ${error}`,
      );
    }
  }

  async getNoticeCount(searchData: ReqNoticeSearchDto): Promise<number> {
    try {
      const queryBuilder = this.noticeRepository
        .createQueryBuilder()
        .select(['TbNotice.noticeId']);

      // 검색 조건 적용
      if (searchData) {
        if (searchData.searchTitle?.trim()) {
          queryBuilder.andWhere('TbNotice.noticeTitle LIKE :title', {
            title: `%${searchData.searchTitle}%`,
          });
        }

        if (searchData.searchStDate?.trim()) {
          queryBuilder.andWhere('DATE(TbNotice.noticeRegDate) >= :startDate', {
            startDate: searchData.searchStDate,
          });
        }

        if (searchData.searchEdDate?.trim()) {
          queryBuilder.andWhere('DATE(TbNotice.noticeRegDate) <= :endDate', {
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

  async create(text: ReqNoticeTextDto, file: FileDto, loginId: string) {
    try {
      const getMaxId = await this.noticeRepository
        .createQueryBuilder()
        .select('IFNULL(MAX(TbNotice.notice_id), 0)', 'maxId')
        .getRawOne();

      const nextId = Number(getMaxId.maxId) + 1;

      const queryBuilder = this.noticeRepository
        .createQueryBuilder()
        .insert()
        .into(TbNotice)
        .values({
          noticeId: nextId,
          loginId,
          noticeTitle: text.title.trim(),
          noticeContent: text.content.trim(),
          noticeRegDate: () => 'NOW()',
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

    return `This action returns a #${id} notice`;
  }

  async update(updateNoticeDto: ReqNoticeUpdateDto) {
    try {
      const queryBuilder = await this.noticeRepository
        .createQueryBuilder()
        .update(TbNotice)
        .set({
          noticeTitle: updateNoticeDto.noticeTitle,
          noticeContent: updateNoticeDto.noticeContent,
        })
        .where('noticeId = :id', { id: updateNoticeDto.noticeId })
        .execute();

      return queryBuilder;
    } catch (error) {
      throw new InternalServerErrorException(
        `공지사항 수정 중 오류가 발생했습니다. ${error}`,
      );
    }
  }

  async remove(id: number) {
    try {
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
}
