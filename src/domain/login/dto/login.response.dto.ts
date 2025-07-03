import { TbUserinfo } from 'src/entities/TbUserinfo';

export class LoginResponseDto {
  user: TbUserinfo;
  menus: MenuDto[];
}

export class MenuDto {
  mnuId: string;
  mnuName: string;
  lvl: number;
  hirMnuId?: string;
  odr: number;
  childList?: MenuDto[]; // 자식 메뉴 목록
}
