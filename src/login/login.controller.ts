// login.controller.ts
import {
  Controller,
  Post,
  UseGuards,
  Req,
  Res,
  HttpCode,
  Logger,
} from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { Request, Response } from 'express';

@Controller('login')
export class LoginController {
  private logger = new Logger('LoginController');

  @UseGuards(LocalAuthGuard) // 수정된 가드 사용
  @Post('loginProc.do')
  @HttpCode(200)
  login(@Req() req: Request) {
    // session.user 명시적 저장 제거 (Passport가 자동 처리)
    this.logger.log(`로그인 성공: ${JSON.stringify(req.user)}`);
    return {
      result: 'SUCCESS',
      user: req.user,
    };
  }

  @Post('me')
  getMe(@Req() req: Request) {
    this.logger.log(`현재 사용자 확인: ${JSON.stringify(req.user)}`);
    if (req.isAuthenticated && req.isAuthenticated()) {
      return {
        result: 'AUTHORIZED',
        user: req.user,
      };
    } else {
      return {
        result: 'UNAUTHORIZED',
      };
    }
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.logout((err) => {
      if (err) {
        this.logger.error('로그아웃 중 오류:', err);
        return res
          .status(500)
          .send({ result: 'ERROR', message: '로그아웃 실패' });
      }

      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          this.logger.error('세션 삭제 중 오류:', destroyErr);
          return res
            .status(500)
            .send({ result: 'ERROR', message: '세션 삭제 실패' });
        }

        res.clearCookie('connect.sid'); // 기본 세션 쿠키명
        res.send({ result: 'LOGOUT' });
      });
    });
  }
}
