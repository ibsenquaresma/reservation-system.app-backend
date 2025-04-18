import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth') // agrupa no Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  register(@Body() body: { email: string; password: string }) {
    return this.authService.register(body.email, body.password);
  }

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
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }
}