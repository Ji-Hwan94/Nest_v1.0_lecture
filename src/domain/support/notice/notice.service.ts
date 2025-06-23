import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { NoticeRequestDto } from './dto/notice.request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TbNotice } from 'src/entities/TbNotice';
import { Repository } from 'typeorm';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(TbNotice)
    private noticeRepository: Repository<TbNotice>,
  ) {}

  create(createNoticeDto) {
    return 'This action adds a new notice';
  }

  async getNoticeList(searchData: NoticeRequestDto) {
    try {
      const queryBuilder = this.noticeRepository
        .createQueryBuilder('notice')
        .select([
          'notice.noticeId',
          'notice.loginId',
          'notice.noticeTitle',
          'notice.noticeContent',
          'notice.noticeRegDate',
        ])
        .orderBy('notice.noticeRegDate', 'DESC')
        .skip((searchData.currentPage - 1) * searchData.pageSize)
        .take(searchData.pageSize);

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

      return queryBuilder.getMany();
    } catch (error) {
      throw new InternalServerErrorException(
        '공지사항 조회 중 오류가 발생했습니다.',
      );
    }
  }

  getNoticeCount(searchData: NoticeRequestDto) {
    try {
      const queryBuilder = this.noticeRepository
        .createQueryBuilder('notice')
        .select(['count(notice.noticeId)'])
        .orderBy('notice.noticeRegDate', 'DESC');

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

      return queryBuilder.getCount();
    } catch (error) {
      throw new InternalServerErrorException(
        '공지사항 조회 중 오류가 발생했습니다.',
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} notice`;
  }

  update(id: number, updateNoticeDto) {
    return `This action updates a #${id} notice`;
  }

  remove(id: number) {
    return `This action removes a #${id} notice`;
  }
}
