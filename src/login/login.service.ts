import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger, Session } from '@nestjs/common';
import { TbUserinfo } from 'src/entities/TbUserinfo';
import { Repository } from 'typeorm';
import { LoginRequestDto } from './dto/login.request.dto';
import { TmMnuMst } from 'src/entities/TmMnuMst';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(TbUserinfo)
    private usersRepository: Repository<TbUserinfo>,

    @InjectRepository(TmMnuMst)
    private tmMnuRepository: Repository<TmMnuMst>,
  ) {}

  private logger = new Logger('HTTP');

  async checkLogin(loginInfo: LoginRequestDto) {
    const user = await this.usersRepository.findOne({
      where: {
        loginId: loginInfo.id,
        password: loginInfo.password,
      },
    });

    if (user) {
      const parentMenus = await this.getParentMenu(user.userType);

      // Promise.all을 사용하여 모든 자식 메뉴 조회를 병렬로 처리
      const menuWithChildren = await Promise.all(
        parentMenus.map(async (parentMenu) => {
          const childMenus = await this.getChildMenu(
            user.userType,
            parentMenu.mnuId, // 자식메뉴 조회시 사용할 부모메뉴 ID
          );

          // 부모 메뉴에 자식 메뉴 목록 추가
          return {
            ...parentMenu,
            childList: childMenus, // 자식 메뉴 목록 추가
          };
        }),
      );

      return {
        user,
        menus: menuWithChildren,
        result: 'SUCCESS',
      };
    } else {
      return {
        result: 'FAIL',
      };
    }
  }

  async getParentMenu(userType: string) {
    const ParentMenu = await this.tmMnuRepository.find({
      where: {
        mnuDvsCod: userType,
        lvl: 0,
      },
      order: {
        odr: 'ASC',
      },
    });

    return ParentMenu;
  }

  async getChildMenu(userType: string, hirMnuId: string) {
    const ChildMenu = await this.tmMnuRepository.find({
      where: {
        mnuDvsCod: userType,
        lvl: 1,
        hirMnuId: hirMnuId,
      },
      order: {
        odr: 'ASC',
      },
    });
    return ChildMenu;
  }
}
