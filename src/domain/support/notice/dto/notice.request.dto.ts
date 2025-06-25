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
