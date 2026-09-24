import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'lucas@email.com' })
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email: string;

  @ApiProperty({ example: 'senha123' })
  @IsString({ message: 'A senha deve ser um texto.' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password: string;

  @ApiProperty({
    description: 'Token gerado pelo widget Cloudflare Turnstile.',
    example: '0.Abc123...',
  })
  @IsString({ message: 'O token de segurança deve ser um texto.' })
  @IsNotEmpty({ message: 'Conclua a verificação de segurança.' })
  @MaxLength(2048, { message: 'O token de segurança é inválido.' })
  turnstileToken: string;
}
