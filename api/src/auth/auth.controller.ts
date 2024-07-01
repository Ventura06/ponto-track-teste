import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { SkipAuth } from 'src/skip-auth/skip-auth.decorator';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @SkipAuth()
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('logout')
  async signOut(@Req() request: Request) {
    const accessToken = request.headers.authorization.split(' ')[1];
    return await this.authService.signOut(accessToken);
  }
}
