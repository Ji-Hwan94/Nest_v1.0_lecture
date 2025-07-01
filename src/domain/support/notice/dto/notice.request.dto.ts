export class ReqNoticeSearchDto {
  searchTitle: string;
  searchStDate: string;
  searchEdDate: string;
  pageSize: number;
  currentPage: number;
}

export class ReqNoticeTextDto {
  title: string;
  content: string;
}

export class ReqNoticeUpdateDto {
  noticeId: number;
  title: string;
  content: string;
}
