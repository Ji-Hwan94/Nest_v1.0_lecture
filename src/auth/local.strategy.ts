import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginService } from 'src/domain/login/login.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly loginService: LoginService) {
    // 기본값: username/password → 여기선 id/password로 바꾸기 위해 override
    super({ usernameField: 'id', passwordField: 'password' });
  }

  async validate(id: string, password: string): Promise<any> {
    const loginInfo = { id, password };
    const result = await this.loginService.checkLogin(loginInfo);

    if (result.result !== 'SUCCESS') {
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    // validate()의 리턴 값이 req.user에 들어감
    return {
      ...result.user,
      usrMnuAtrt: result.menus,
    };
  }
}
