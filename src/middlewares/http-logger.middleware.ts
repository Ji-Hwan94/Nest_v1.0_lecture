import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    // 1번 라우터 보다 먼저 실행이 되어 req의 정보를 기록하고
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    // 3번 라우터 끝나고 실행
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });

    // 2번 라우터로 이동
    next();
  }
}
