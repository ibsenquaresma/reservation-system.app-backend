import { Controller, Post, Body, Res, Req, UseGuards, Param, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBody, ApiParam, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { Throttle } from '@nestjs/throttler';
import { LoginDto } from 'src/User/dto/LoginDto';
import { RegisterDto } from 'src/User/dto/RegisterDto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'test@example.com' },
        password: { type: 'string', example: '123456' },
      },
    },
  })
  @Throttle(2, 60)
  async register(@Body() dto: RegisterDto) {
    const { email, password } = dto;
    return this.authService.register(email, password);
  }

  // @Post('login')
  // @ApiBody({ type: AuthDto })
  // login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: any) {
  //   return this.authService.login(dto.email, dto.password, res);
  // }

  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'test@example.com' },
        password: { type: 'string', example: '123456' },
      },
    },
  })
  
  @Post('login')
  @HttpCode(200)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Login successful' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @Throttle(5, 60)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  // @Post('refresh')
  // refresh(@Req() req: any, @Res({ passthrough: true }) res: any) {
  //   const token = req.cookies?.refreshToken;
  //   const payload = this.authService['jwtService'].verify(token);
  //   return this.authService.refresh(payload.sub, res);
  // }
  @Post('refresh/:userId') // O parâmetro é passado pela URL
  @ApiParam({ name: 'userId', description: 'User ID for refresh token' }) // Swagger documenta o userId
  async refresh(@Param('userId') userId: number, @Res() res: any) {
    return this.authService.refresh(userId, res);
  }
}