import {
  Controller,
  Get,
  UseGuards,
  UseFilters,
  Req,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthExceptionFilter } from './auth-exception.filter';

@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Passport handles the redirect to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @UseFilters(AuthExceptionFilter)
  googleCallback(@Req() _req: Request, @Res() res: Response) {
    res.redirect('/success');
  }
}
