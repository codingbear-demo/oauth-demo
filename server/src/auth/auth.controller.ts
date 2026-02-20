import {
  Controller,
  Get,
  UseGuards,
  UseFilters,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { GoogleAuthGuard } from './google-auth.guard';
import { AuthExceptionFilter } from './auth-exception.filter';

@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    // Passport handles the redirect to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @UseFilters(AuthExceptionFilter)
  googleCallback(@Req() _req: Request, @Res() res: Response) {
    res.redirect('/success');
  }
}
