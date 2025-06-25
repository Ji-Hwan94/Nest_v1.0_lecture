// session.serializer.ts
import { PassportSerializer } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  private logger = new Logger('SessionSerializer');

  serializeUser(user: any, done: Function) {
    this.logger.log(`Serializing user: ${user.loginId}`);
    // 사용자 ID만 세션에 저장 (보안과 메모리 효율성을 위해)
    done(null, {
      loginId: user.loginId,
      userType: user.userType,
    });
  }

  deserializeUser(payload: any, done: Function) {
    this.logger.log(`Deserializing user: ${payload.loginId}`);
    // 필요시 여기서 데이터베이스에서 최신 사용자 정보를 조회할 수 있음
    done(null, payload);
  }
}
