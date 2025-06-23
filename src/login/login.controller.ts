import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  Session,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginRequestDto } from './dto/login.request.dto';

@Controller('login')
export class LoginController {
  constructor(private loginService: LoginService) {}

  private logger = new Logger('HTTP');

  @Post('loginProc.do')
  @HttpCode(200)
  async checkLogin(
    @Body() param: LoginRequestDto,
    @Session() session: Record<string, any>,
  ) {
    this.logger.log(`param ========== ${param}`);
    return await this.loginService.checkLogin(param, session);
  }
}
