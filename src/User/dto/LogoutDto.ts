import { ApiProperty } from '@nestjs/swagger';

class LoginDto {
  @ApiProperty({
    example: 'user@example.com', // Exemplo de valor para o parâmetro
  })
  email: string;

  @ApiProperty({
    example: 'password123', // Exemplo de senha
  })
  password: string;
}