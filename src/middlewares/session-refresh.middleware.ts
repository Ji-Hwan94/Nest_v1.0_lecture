import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SessionRefreshMiddleware implements NestMiddleware {
  private logger = new Logger('SessionRefresh');

  use(req: Request, res: Response, next: NextFunction): void {
    // 세션 디버깅 정보 로깅
    this.logger.debug(`=== 세션 갱신 미들웨어 실행 ===`);
    this.logger.debug(`URL: ${req.url}`);
    this.logger.debug(`세션 ID: ${req.sessionID}`);
    this.logger.debug(`세션 존재: ${!!req.session}`);
    this.logger.debug(`req.user: ${JSON.stringify(req.user)}`);
    this.logger.debug(`isAuthenticated 함수 존재: ${!!req.isAuthenticated}`);

    // 인증된 사용자의 세션을 갱신
    if (req.session && req.isAuthenticated && req.isAuthenticated()) {
      // 세션을 갱신하여 만료 시간을 연장
      req.session.touch();
      const user = req.user as any;
      this.logger.debug(`세션 갱신 성공: ${user?.loginId || 'unknown'}`);
    } else {
      this.logger.debug(`세션 갱신 실패 - 인증되지 않음`);
      if (!req.session) {
        this.logger.debug(`원인: 세션이 없음`);
      } else if (!req.isAuthenticated) {
        this.logger.debug(`원인: isAuthenticated 함수가 없음`);
      } else if (!req.isAuthenticated()) {
        this.logger.debug(`원인: 인증되지 않은 사용자`);
      }
    }

    next();
  }
}
