// login.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { TbUserinfo } from 'src/entities/TbUserinfo';
import { TmMnuMst } from 'src/entities/TmMnuMst';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/auth/local.strategy';
import { SessionSerializer } from 'src/auth/session.serializer';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

@Module({
  imports: [
    PassportModule.register({ session: true }), // 세션 사용 명시
    TypeOrmModule.forFeature([TbUserinfo, TmMnuMst]),
  ],
  controllers: [LoginController],
  providers: [LoginService, LocalStrategy, SessionSerializer, LocalAuthGuard],
  exports: [LocalAuthGuard], // 다른 모듈에서 사용할 수 있도록 export
})
export class LoginModule {}
