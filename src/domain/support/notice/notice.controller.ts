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
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeRequestDto } from './dto/notice.request.dto';

@Controller('/support/')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  private logger = new Logger('HTTP');

  @Post()
  create(@Body() createNoticeDto) {
    return this.noticeService.create(createNoticeDto);
  }

  @Get('noticeList.do')
  async getNoticeList(@Query() searchData: NoticeRequestDto) {
    this.logger.log(`param ======= ${JSON.stringify(searchData)}`);
    const list = await this.noticeService.getNoticeList(searchData);
    const count = await this.noticeService.getNoticeCount(searchData);

    return { list, count };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.noticeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoticeDto) {
    return this.noticeService.update(+id, updateNoticeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.noticeService.remove(+id);
  }
}
