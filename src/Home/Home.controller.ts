import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';

@Controller('home')
export class HomeController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getHome() {
    return { message: 'You are authenticated!' };
  }
}