// login.controller.ts
import {
  Controller,
  Post,
  UseGuards,
  Req,
  Res,
  HttpCode,
  Logger,
  Get,
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

  // 세션 디버깅용 엔드포인트 추가
  @Get('debug-session')
  debugSession(@Req() req: Request) {
    this.logger.log('=== 세션 디버깅 정보 ===');
    this.logger.log(`세션 ID: ${req.sessionID}`);
    this.logger.log(`세션 데이터: ${JSON.stringify(req.session)}`);
    this.logger.log(`req.user: ${JSON.stringify(req.user)}`);
    this.logger.log(
      `인증 상태: ${req.isAuthenticated ? req.isAuthenticated() : 'isAuthenticated 함수 없음'}`,
    );
    this.logger.log(`쿠키: ${req.headers.cookie}`);

    return {
      sessionID: req.sessionID,
      session: req.session,
      user: req.user,
      isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : false,
      cookies: req.headers.cookie,
    };
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

        res.clearCookie('happy-job-session'); // 새로운 세션 쿠키명 사용
        res.send({ result: 'LOGOUT' });
      });
    });
  }
}
