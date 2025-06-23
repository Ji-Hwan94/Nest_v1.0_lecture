import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TbUserinfo } from 'src/entities/TbUserinfo';
import { TmMnuMst } from 'src/entities/TmMnuMst';

@Module({
  imports: [TypeOrmModule.forFeature([TbUserinfo, TmMnuMst])],
  providers: [LoginService],
  controllers: [LoginController],
})
export class LoginModule {}
