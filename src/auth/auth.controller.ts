import { Controller, Post, Body, Res, Request, Req, UseGuards, Param, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBody, ApiParam, ApiOkResponse, ApiUnauthorizedResponse, ApiCreatedResponse, ApiConflictResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { Throttle } from '@nestjs/throttler';
import { LoginDto } from 'src/User/dto/LoginDto';
import { RegisterDto } from 'src/User/dto/RegisterDto';
import { ForgotPasswordDto } from 'src/User/dto/forgot-password.dto';
import { ResetPasswordDto } from 'src/User/dto/reset-password.dto';
import { JwtAuthGuard } from './jwt.authguard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ description: 'User registered successfully' })
  @ApiConflictResponse({ description: 'User already exists' })
  @Throttle(2, 60)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.username, dto.email, dto.password);
  }


  @Post('login')
  @HttpCode(200)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Login successful' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @Throttle(5, 60)
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(
      dto.email,
      dto.password,
    );
    return this.authService.login(dto.email, dto.password);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send password reset link' })  // Descrição da operação
  @ApiBody({ description: 'Email address to send the reset link to', type: ForgotPasswordDto })  // Descrição do body
  @ApiResponse({ status: 200, description: 'Reset link sent successfully' })  // Resposta de sucesso
  @ApiResponse({ status: 404, description: 'User not found' })  // Resposta caso não encontre o usuário
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.sendResetToken(dto.email);
  }

  @Post('refresh/:userId') // O parâmetro é passado pela URL
  @ApiParam({ name: 'userId', description: 'User ID for refresh token' }) // Swagger documenta o userId
  async refresh(@Param('userId') userId: number, @Res() res: any) {
    return this.authService.refresh(userId, res);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.password);
  }
}