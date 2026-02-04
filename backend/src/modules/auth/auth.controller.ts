import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('profile')
  @UseGuards(AuthGuard('firebase-jwt'))
  getProfile(@Request() req) {
    return req.user;
  }
}
