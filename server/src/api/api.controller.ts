import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Controller('api')
export class ApiController {
  @Get('me')
  getMe(@Req() req: Request) {
    if (!req.isAuthenticated()) {
      throw new UnauthorizedException('Not authenticated');
    }
    return req.user;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await new Promise<void>((resolve, reject) => {
      req.logout((err) => (err ? reject(err) : resolve()));
    });

    await new Promise<void>((resolve) => {
      req.session.destroy(() => resolve());
    });

    res.clearCookie('connect.sid');
    return { message: 'Logged out' };
  }
}
