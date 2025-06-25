import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import {
  ReqNoticeSearchDto,
  ReqNoticeTextDto,
  ReqNoticeUpdateDto,
} from './dto/notice.request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDto } from 'src/domain/common/dto/common.file.dto';

@Controller('/support/')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  private logger = new Logger('HTTP');

  // DTO 사용하는 이유
  // 어떤 데이터가 들어올지 모름 -> 타입체크 가능
  // 오타가 있으면 컴파일 시점에서 에러
  // 유효성 검사 가능 (npm install class-validator class-transformer  @IsString(), @MaxLength(255), @IsOptional() 등)
  // API 문서화
  // Swagger와 같은 도구를 사용할 때 DTO를 기반으로 자동으로 API 문서가 생성됨
  // 프론트엔드 개발자가 필요한 파라미터를 쉽게 파악 가능
  @Get('noticeList.do')
  async findAll(@Query() searchParam: ReqNoticeSearchDto) {
    this.logger.log(`param ======= ${JSON.stringify(searchParam)}`);
    const list = await this.noticeService.getNoticeList(searchParam);
    const count = await this.noticeService.getNoticeCount(searchParam);

    return { list, count };
  }

  @Post('noticeSave.do')
  @UseInterceptors(FileInterceptor('file')) // FormData에서 'file'이라는 이름의 필드를 찾아서 파일 데이터를 추출
  async create(
    @Body() insertParam: ReqNoticeTextDto,
    @UploadedFile() file: FileDto,
    @Req() req,
  ) {
    // 로그인 정보가 없으면 예외 처리
    if (!req.user || !req.user['loginId']) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
    this.logger.log('req.user======================= ', req);

    try {
      await this.noticeService.create(insertParam, file, req.user['loginId']);

      return { result: 'SUCCESS' };
    } catch (error) {
      this.logger.error('공지사항 등록 실패:', error);
      throw new InternalServerErrorException(
        '공지사항 등록 중 오류가 발생했습니다.',
      );
    }
  }

  @Get('noticeDetail.do')
  async findOne(@Query('id') id: number) {
    this.logger.log(`id ============== ${id}`);

    const detail = await this.noticeService.findOne(id);

    return detail;
  }

  @Patch('noticeUpdate.do')
  async update(@Body() updateNoticeDto: ReqNoticeUpdateDto) {
    this.logger.log(`update ============== ${JSON.stringify(updateNoticeDto)}`);

    try {
      await this.noticeService.update(updateNoticeDto);

      return { result: 'SUCCESS' };
    } catch (error) {
      this.logger.error('공지사항 등록 실패:', error);
      throw new InternalServerErrorException(
        '공지사항 등록 중 오류가 발생했습니다.',
      );
    }
  }

  @Delete('noticeDelete.do')
  async remove(@Query('id') id: number) {
    this.logger.log(`delete ============== ${id}`);

    await this.noticeService.remove(id);

    return { result: 'SUCCESS' };

    // return this.noticeService.remove(+id);
  }
}
